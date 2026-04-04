'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { deleteCategory } from '@/lib/admin-actions'

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Delete "${name}"? Sounds in this category won't be deleted.`)) return
    startTransition(() => deleteCategory(id))
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
      {isPending ? '…' : 'Delete'}
    </Button>
  )
}
