#!/usr/bin/env node
/**
 * download-and-upload.mjs
 *
 * For each entry in supabase/seed_sounds_youtube_sources.json:
 *   1. Downloads audio from YouTube via yt-dlp (clips to start/end if provided)
 *   2. Uploads the MP3 to Cloudflare R2 as sounds/{slug}.mp3
 *   3. Prints UPDATE SQL to patch the placeholder audio_url in the seed
 *
 * Usage:
 *   node scripts/download-and-upload.mjs
 *   node scripts/download-and-upload.mjs --dry-run        # skip upload, just download
 *   node scripts/download-and-upload.mjs --id snd-01      # process one entry only
 *   node scripts/download-and-upload.mjs --skip-existing  # skip if R2 key already uploaded
 *
 * Prerequisites:
 *   brew install yt-dlp ffmpeg
 */

import { readFileSync, mkdirSync, existsSync, unlinkSync } from 'fs'
import { execSync, spawnSync } from 'child_process'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ─── Config ──────────────────────────────────────────────────────────────────

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT   = resolve(__dir, '..')
const TMP    = resolve(ROOT, 'tmp-audio')
const SOURCES = resolve(ROOT, 'supabase/seed_sounds_youtube_sources.json')

// Parse .env.local manually (no dotenv dependency needed in Node 20)
const envPath = resolve(ROOT, '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.trim() && !l.startsWith('#'))
    .map(l => l.split('=').map((p, i) => i === 0 ? p.trim() : l.slice(l.indexOf('=') + 1).trim()))
)

const R2_ACCOUNT_ID      = env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID   = env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME     = env.R2_BUCKET_NAME
const R2_PUBLIC_URL      = env.NEXT_PUBLIC_R2_PUBLIC_URL

// ─── CLI flags ───────────────────────────────────────────────────────────────

const args         = process.argv.slice(2)
const DRY_RUN      = args.includes('--dry-run')
const SKIP_EXISTING = args.includes('--skip-existing')
const onlyId       = (() => { const i = args.indexOf('--id'); return i !== -1 ? args[i + 1] : null })()

// ─── R2 client ───────────────────────────────────────────────────────────────

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(prefix, msg) {
  const colours = { '✓': '\x1b[32m', '✗': '\x1b[31m', '→': '\x1b[36m', '⚠': '\x1b[33m', 'i': '\x1b[90m' }
  const reset = '\x1b[0m'
  console.log(`${colours[prefix] ?? ''}${prefix}${reset} ${msg}`)
}

function checkDep(cmd) {
  const result = spawnSync('which', [cmd], { encoding: 'utf8' })
  if (result.status !== 0) {
    console.error(`\x1b[31mMissing dependency: ${cmd}\x1b[0m`)
    console.error(`  Install with: brew install ${cmd}`)
    process.exit(1)
  }
}

async function objectExists(key) {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))
    return true
  } catch {
    return false
  }
}

/**
 * Download audio from YouTube using yt-dlp.
 * If clip_start_seconds and clip_end_seconds are set, clips the segment.
 * Returns the path to the downloaded MP3.
 */
function downloadAudio(entry, outputDir) {
  const { id, slug, youtube_video_id, clip_start_seconds, clip_end_seconds } = entry
  const outTemplate = resolve(outputDir, `${slug}.%(ext)s`)
  const url = `https://www.youtube.com/watch?v=${youtube_video_id}`

  const ytdlpArgs = [
    '-x',
    '--audio-format', 'mp3',
    '--audio-quality', '0',           // best quality
    '--no-playlist',
    '-o', outTemplate,
  ]

  // Add clip section if timestamps are provided
  if (clip_start_seconds != null && clip_end_seconds != null) {
    ytdlpArgs.push('--download-sections', `*${clip_start_seconds}-${clip_end_seconds}`)
    ytdlpArgs.push('--force-keyframes-at-cuts')
  }

  ytdlpArgs.push(url)

  log('→', `[${id}] Downloading: ${entry.title}`)
  if (clip_start_seconds != null) {
    log('i', `    Clipping ${clip_start_seconds}s → ${clip_end_seconds}s`)
  }

  const result = spawnSync('yt-dlp', ytdlpArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

  if (result.status !== 0) {
    throw new Error(`yt-dlp failed:\n${result.stderr}`)
  }

  const mp3Path = resolve(outputDir, `${slug}.mp3`)
  if (!existsSync(mp3Path)) {
    throw new Error(`Expected output file not found: ${mp3Path}`)
  }

  return mp3Path
}

/**
 * Upload a local MP3 file to R2.
 * Returns the public URL.
 */
async function uploadToR2(localPath, slug) {
  const key = `sounds/${slug}.mp3`
  const body = readFileSync(localPath)

  await r2.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: 'audio/mpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }))

  return { key, url: `${R2_PUBLIC_URL}/${key}` }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Check prerequisites
  checkDep('yt-dlp')
  checkDep('ffmpeg')

  mkdirSync(TMP, { recursive: true })

  const sources = JSON.parse(readFileSync(SOURCES, 'utf8'))

  const toProcess = onlyId
    ? sources.filter(e => e.id === onlyId)
    : sources

  const sqlUpdates = []
  const skipped    = []
  const failed     = []

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`  Processing ${toProcess.length} sound(s)${DRY_RUN ? '  [DRY RUN — no upload]' : ''}`)
  console.log(`${'─'.repeat(60)}\n`)

  for (const entry of toProcess) {
    const { id, slug, title, youtube_video_id } = entry

    // Skip entries that need manual sourcing
    if (!youtube_video_id || youtube_video_id === 'SEARCH_REQUIRED') {
      log('⚠', `[${id}] Skipped (no confirmed video ID): ${title}`)
      log('i', `    Search: ${entry.youtube_url}`)
      log('i', `    Note:   ${entry.clip_note}`)
      skipped.push(entry)
      console.log()
      continue
    }

    const r2Key = `sounds/${slug}.mp3`

    // Optionally skip if already uploaded
    if (SKIP_EXISTING && !DRY_RUN) {
      const exists = await objectExists(r2Key)
      if (exists) {
        const url = `${R2_PUBLIC_URL}/${r2Key}`
        log('i', `[${id}] Already on R2, skipping: ${title}`)
        sqlUpdates.push({ slug, url })
        continue
      }
    }

    let mp3Path
    try {
      mp3Path = downloadAudio(entry, TMP)
      log('✓', `[${id}] Downloaded → ${mp3Path.replace(ROOT, '.')}`)
    } catch (err) {
      log('✗', `[${id}] Download failed: ${err.message.split('\n')[0]}`)
      failed.push({ entry, reason: err.message })
      console.log()
      continue
    }

    if (DRY_RUN) {
      log('i', `[${id}] Dry run — skipping upload`)
      console.log()
      continue
    }

    try {
      const { url } = await uploadToR2(mp3Path, slug)
      log('✓', `[${id}] Uploaded  → ${url}`)
      sqlUpdates.push({ slug, url })
    } catch (err) {
      log('✗', `[${id}] Upload failed: ${err.message}`)
      failed.push({ entry, reason: err.message })
    }

    // Clean up local temp file to save disk space
    try { unlinkSync(mp3Path) } catch {}

    console.log()
  }

  // ─── Summary ───────────────────────────────────────────────────────────────

  console.log(`${'─'.repeat(60)}`)
  console.log(`  Done. Uploaded: ${sqlUpdates.length}  Skipped: ${skipped.length}  Failed: ${failed.length}`)
  console.log(`${'─'.repeat(60)}\n`)

  // ─── SQL output ────────────────────────────────────────────────────────────

  if (sqlUpdates.length > 0) {
    console.log('-- ── Paste these into Supabase SQL Editor ───────────────────')
    for (const { slug, url } of sqlUpdates) {
      console.log(`UPDATE sounds SET audio_url = '${url}' WHERE slug = '${slug}';`)
    }
    console.log()
  }

  // ─── Manual sourcing guide ─────────────────────────────────────────────────

  if (skipped.length > 0) {
    console.log('-- ── Sounds that need a manual video ID ─────────────────────')
    console.log('-- Edit supabase/seed_sounds_youtube_sources.json, set')
    console.log('-- youtube_video_id to the actual video ID, then re-run.')
    console.log()
    for (const e of skipped) {
      console.log(`-- [${e.id}] ${e.title}`)
      console.log(`--   Search: ${e.youtube_url}`)
      console.log(`--   Hint:   ${e.clip_note}`)
      console.log()
    }
  }

  if (failed.length > 0) {
    console.error('-- ── Failed entries ──────────────────────────────────────────')
    for (const { entry, reason } of failed) {
      console.error(`-- [${entry.id}] ${entry.title}: ${reason.split('\n')[0]}`)
    }
  }
}

main().catch(err => {
  console.error('\x1b[31mFatal error:\x1b[0m', err.message)
  process.exit(1)
})
