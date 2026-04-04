'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { deleteSound, togglePublished } from '@/lib/admin-actions'

export function DeleteSoundButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    startTransition(() => deleteSound(id))
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
      {isPending ? '…' : 'Delete'}
    </Button>
  )
}

export function TogglePublishButton({ id, isPublished }: { id: string; isPublished: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => startTransition(() => togglePublished(id, isPublished))}
      disabled={isPending}
    >
      {isPublished ? 'Hide' : 'Publish'}
    </Button>
  )
}
