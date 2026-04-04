import { getCategories } from '@/lib/actions'
import { createSound } from '@/lib/admin-actions'
import { SoundForm } from '@/components/admin/SoundForm'

export default async function NewSoundPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Add Sound</h1>
      <SoundForm categories={categories} action={createSound} />
    </div>
  )
}
