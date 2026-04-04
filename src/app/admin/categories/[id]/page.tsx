import { notFound } from 'next/navigation'
import { adminDb } from '@/lib/supabase'
import { updateCategory } from '@/lib/admin-actions'
import { CategoryForm } from '@/components/admin/CategoryForm'

interface Props { params: Promise<{ id: string }> }

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params
  const { data } = await adminDb.from('categories').select('*').eq('id', id).single()
  if (!data) notFound()

  async function action(formData: FormData) {
    'use server'
    return updateCategory(id, formData)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Edit Category</h1>
      <CategoryForm category={data} action={action} />
    </div>
  )
}
