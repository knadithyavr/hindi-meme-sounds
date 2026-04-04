import { NextRequest, NextResponse } from 'next/server'
import { db, adminDb } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Rate limit: 20 downloads per IP per minute
  // Generous enough for any real user, blocks bots hammering the endpoint
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(`download:${ip}`, 20, 60_000)) {
    return new NextResponse('Too many requests', { status: 429 })
  }

  const { slug } = await params

  const { data: sound } = await db
    .from('sounds')
    .select('id, audio_url, slug')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!sound) return new NextResponse('Not found', { status: 404 })

  const r2Response = await fetch(sound.audio_url)
  if (!r2Response.ok) return new NextResponse('File unavailable', { status: 502 })

  void adminDb.rpc('increment_download_count', { sound_id: sound.id })

  return new NextResponse(r2Response.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `attachment; filename="${sound.slug}.mp3"`,
      'Cache-Control': 'no-store',
    },
  })
}
