'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminDb } from './supabase'
import { createSupabaseServerClient } from './supabase-server'
import { uploadAudio, deleteAudio } from './r2'
import { slugify } from './utils'

// ─── Auth guard — called at the top of every admin mutation ──────────────────

async function assertAdmin(): Promise<void> {
  const client = await createSupabaseServerClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized')
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate admin email BEFORE sign-in — eliminates TOCTOU race
  if (email !== process.env.ADMIN_EMAIL) {
    return { error: 'Not authorized' }
  }

  const client = await createSupabaseServerClient()
  const { error } = await client.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect('/admin')
}

export async function adminLogout() {
  const client = await createSupabaseServerClient()
  await client.auth.signOut()
  redirect('/admin/login')
}

// ─── Sounds ──────────────────────────────────────────────────────────────────

export async function createSound(formData: FormData) {
  await assertAdmin()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const audioFile = formData.get('audio') as File
  const categoryIds = formData.getAll('categories') as string[]
  const tagsRaw = formData.get('tags') as string

  if (!title || !audioFile?.size) return { error: 'Title and audio file are required' }

  const MAX_SIZE = 50 * 1024 * 1024 // 50MB
  if (audioFile.size > MAX_SIZE) return { error: 'File too large. Maximum size is 50MB.' }

  const audioUrl = await uploadAudio(audioFile)

  let slug = slugify(title)
  const { data: existing } = await adminDb.from('sounds').select('slug').eq('slug', slug)
  if (existing?.length) slug = `${slug}-${Date.now()}`

  const { data: sound, error } = await adminDb
    .from('sounds')
    .insert({ title, slug, description, audio_url: audioUrl, is_published: true, status: 'approved' })
    .select('id')
    .single()

  if (error || !sound) {
    await deleteAudio(audioUrl).catch(() => {})
    return { error: error?.message ?? 'Failed to create sound' }
  }

  if (categoryIds.length) {
    await adminDb.from('sound_categories').insert(
      categoryIds.map(category_id => ({ sound_id: sound.id, category_id }))
    )
  }

  if (tagsRaw?.trim()) {
    const tagNames = tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    for (const name of tagNames) {
      const tagSlug = slugify(name)
      const { data: tag } = await adminDb
        .from('tags')
        .upsert({ name, slug: tagSlug }, { onConflict: 'slug' })
        .select('id')
        .single()
      if (tag) {
        await adminDb.from('sound_tags').insert({ sound_id: sound.id, tag_id: tag.id })
      }
    }
  }

  revalidatePath('/')
  revalidatePath('/trending')
  redirect('/admin/sounds')
}

export async function updateSound(id: string, formData: FormData) {
  await assertAdmin()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const categoryIds = formData.getAll('categories') as string[]
  const tagsRaw = formData.get('tags') as string
  const audioFile = formData.get('audio') as File
  const existingUrl = formData.get('existing_audio_url') as string

  let audioUrl = existingUrl
  if (audioFile?.size) {
    const MAX_SIZE = 50 * 1024 * 1024
    if (audioFile.size > MAX_SIZE) return { error: 'File too large. Maximum size is 50MB.' }
    audioUrl = await uploadAudio(audioFile)
    if (existingUrl) await deleteAudio(existingUrl).catch(() => {})
  }

  const { error } = await adminDb
    .from('sounds')
    .update({ title, description, audio_url: audioUrl })
    .eq('id', id)

  if (error) return { error: error.message }

  await adminDb.from('sound_categories').delete().eq('sound_id', id)
  await adminDb.from('sound_tags').delete().eq('sound_id', id)

  if (categoryIds.length) {
    await adminDb.from('sound_categories').insert(
      categoryIds.map(category_id => ({ sound_id: id, category_id }))
    )
  }

  if (tagsRaw?.trim()) {
    const tagNames = tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    for (const name of tagNames) {
      const tagSlug = slugify(name)
      const { data: tag } = await adminDb
        .from('tags')
        .upsert({ name, slug: tagSlug }, { onConflict: 'slug' })
        .select('id')
        .single()
      if (tag) {
        await adminDb.from('sound_tags').insert({ sound_id: id, tag_id: tag.id })
      }
    }
  }

  revalidatePath('/')
  redirect('/admin/sounds')
}

export async function deleteSound(id: string) {
  await assertAdmin()
  const { data } = await adminDb.from('sounds').select('audio_url').eq('id', id).single()
  if (data?.audio_url) await deleteAudio(data.audio_url).catch(() => {})
  await adminDb.from('sounds').delete().eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin/sounds')
}

export async function togglePublished(id: string, current: boolean) {
  await assertAdmin()
  await adminDb.from('sounds').update({ is_published: !current }).eq('id', id)
  revalidatePath('/')
  revalidatePath('/admin/sounds')
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  await assertAdmin()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const color = formData.get('color') as string

  if (!name) return { error: 'Name is required' }

  const slug = slugify(name)
  const { error } = await adminDb.from('categories').insert({ name, slug, description, color })
  if (error) return { error: error.message }

  revalidatePath('/categories')
  redirect('/admin/categories')
}

export async function updateCategory(id: string, formData: FormData) {
  await assertAdmin()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const color = formData.get('color') as string

  const { error } = await adminDb.from('categories').update({ name, description, color }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/categories')
  redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
  await assertAdmin()
  await adminDb.from('categories').delete().eq('id', id)
  revalidatePath('/categories')
  revalidatePath('/admin/categories')
}
