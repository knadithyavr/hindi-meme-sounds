import { notFound } from 'next/navigation'
import { adminDb } from '@/lib/supabase'
import { getCategories } from '@/lib/actions'
import { updateSound } from '@/lib/admin-actions'
import { SoundForm } from '@/components/admin/SoundForm'
import { normalizeSoundAdmin } from '../utils'

interface Props { params: Promise<{ id: string }> }

export default async function EditSoundPage({ params }: Props) {
  const { id } = await params
  const db = adminDb

  const [{ data }, categories] = await Promise.all([
    db.from('sounds').select(`
      *,
      categories:sound_categories(category:categories(*)),
      tags:sound_tags(tag:tags(*))
    `).eq('id', id).single(),
    getCategories(),
  ])

  if (!data) notFound()

  const sound = normalizeSoundAdmin(data)

  async function action(formData: FormData) {
    'use server'
    return updateSound(id, formData)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Edit Sound</h1>
      <SoundForm categories={categories} sound={sound} action={action} />
    </div>
  )
}
