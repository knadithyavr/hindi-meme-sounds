import Link from 'next/link'
import { getCategories } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { DeleteCategoryButton } from './CategoryActions'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Categories ({categories.length})</h1>
        <Link href="/admin/categories/new">
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Category</Button>
        </Link>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Color</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Sounds</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat.id}>
                <TableCell>
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${cat.color}`} />
                </TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>{cat.audio_count ?? 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/categories/${cat.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <DeleteCategoryButton id={cat.id} name={cat.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
