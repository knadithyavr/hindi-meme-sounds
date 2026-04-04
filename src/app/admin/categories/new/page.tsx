import { createCategory } from '@/lib/admin-actions'
import { CategoryForm } from '@/components/admin/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Add Category</h1>
      <CategoryForm action={createCategory} />
    </div>
  )
}
