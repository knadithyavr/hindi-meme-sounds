import { createClient } from '@supabase/supabase-js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFileSync, existsSync } from 'fs'
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Config ────────────────────────────────────────────────────────────────────
const SUPABASE_URL      = 'https://umtuoslosqmzpakqhmvu.supabase.co'
const SUPABASE_KEY      = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtdHVvc2xvc3FtenBha3FobXZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMjAzNSwiZXhwIjoyMDkwNzg4MDM1fQ.HP1jjzUkHvqKFKuusqMqO64kC97THE7JO9_DDIFEVIM'
const R2_ACCOUNT_ID     = 'fed1735e59a9c394beb69fffcc9f014a'
const R2_ACCESS_KEY_ID  = '7b08857981b387cd7bd9d77f2cc97cbe'
const R2_SECRET_KEY     = 'ff7e2baf87aa0cafa6200244277483487cb397ecf0d0ffb4c7d50c400b595e14'
const R2_BUCKET         = 'hindi-meme-sounds'
const R2_PUBLIC_URL     = 'https://pub-7f76c37e6f484ba3a7b80198ffdca81e.r2.dev'

const SOUNDS_DIR = '/Users/knadithyavr/Documents/audios-meme/telugu-meme/sounds'
const META_FILE  = '/Users/knadithyavr/Documents/audios-meme/telugu-meme/sounds_metadata.json'

// ── Clients ───────────────────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_KEY },
})

// ── Helpers ───────────────────────────────────────────────────────────────────
async function uploadToR2(localPath, slug) {
  const buffer = await readFile(localPath)
  const key = `sounds/telugu-${slug}.mp3`
  await r2.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'audio/mpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }))
  return `${R2_PUBLIC_URL}/${key}`
}

async function upsertCategory(name, slug) {
  const { data, error } = await supabase
    .from('categories')
    .upsert({ name, slug, description: null, color: '#f97316' }, { onConflict: 'slug' })
    .select('id')
    .single()
  if (error) throw new Error(`Category upsert failed for ${slug}: ${error.message}`)
  return data.id
}

async function upsertTag(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const { data, error } = await supabase
    .from('tags')
    .upsert({ name, slug }, { onConflict: 'slug' })
    .select('id')
    .single()
  if (error) throw new Error(`Tag upsert failed for ${name}: ${error.message}`)
  return data.id
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Get Telugu language id
  const { data: lang, error: langErr } = await supabase
    .from('languages')
    .select('id')
    .eq('slug', 'telugu')
    .single()
  if (langErr || !lang) throw new Error('Telugu language not found in DB')
  const languageId = lang.id
  console.log(`Telugu language id: ${languageId}`)

  // 2. Load metadata
  const { data: sounds } = JSON.parse(readFileSync(META_FILE, 'utf8'))
  console.log(`Total sounds in metadata: ${sounds.length}`)

  let inserted = 0, skipped = 0, failed = 0

  for (const sound of sounds) {
    const localPath = join(SOUNDS_DIR, `${sound.slug}.mp3`)

    // Skip if no local file
    if (!existsSync(localPath)) {
      console.warn(`  SKIP (no file): ${sound.slug}`)
      skipped++
      continue
    }

    try {
      // 3. Upload to R2
      const audioUrl = await uploadToR2(localPath, sound.slug)

      // 4. Insert sound row
      const { data: row, error: soundErr } = await supabase
        .from('sounds')
        .insert({
          title: sound.title,
          slug: sound.slug,
          language_id: languageId,
          description: sound.description ?? null,
          audio_url: audioUrl,
          play_count: 0,
          download_count: 0,
          share_count: 0,
          is_published: true,
          is_user_upload: false,
          status: 'approved',
        })
        .select('id')
        .single()

      if (soundErr) {
        // Likely duplicate slug within Telugu — shouldn't happen but log it
        console.error(`  FAIL (insert): ${sound.slug} — ${soundErr.message}`)
        failed++
        continue
      }

      const soundId = row.id

      // 5. Categories
      for (const cat of sound.categories ?? []) {
        const catId = await upsertCategory(cat.name, cat.slug)
        await supabase.from('sound_categories').upsert(
          { sound_id: soundId, category_id: catId },
          { onConflict: 'sound_id,category_id' }
        )
      }

      // 6. Tags
      for (const tag of sound.tags ?? []) {
        if (!tag.name?.trim()) continue
        const tagId = await upsertTag(tag.name.trim())
        await supabase.from('sound_tags').upsert(
          { sound_id: soundId, tag_id: tagId },
          { onConflict: 'sound_id,tag_id' }
        )
      }

      inserted++
      if (inserted % 25 === 0) console.log(`  Progress: ${inserted} inserted...`)

    } catch (err) {
      console.error(`  FAIL: ${sound.slug} — ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. inserted=${inserted}  skipped=${skipped}  failed=${failed}`)
}

main().catch(err => { console.error(err); process.exit(1) })
