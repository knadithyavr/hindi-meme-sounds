'use client'

import { useTransition, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Category, Sound } from '@/types'

interface SoundFormProps {
  categories: Category[]
  sound?: Sound // present when editing
  action: (formData: FormData) => Promise<void | { error: string }>
}

export function SoundForm({ categories, sound, action }: SoundFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const selectedCategoryIds = sound?.categories.map(c => c.id) ?? []
  const defaultTags = sound?.tags.map(t => t.name).join(', ') ?? ''

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await action(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" required defaultValue={sound?.title} placeholder="Bhai kya kar raha hai" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={sound?.description ?? ''}
          placeholder="Describe the sound — this is used for search"
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="audio">
          {sound ? 'Replace Audio (optional)' : 'Audio File (MP3) *'}
        </Label>
        <Input id="audio" name="audio" type="file" accept="audio/mpeg,audio/mp3,.mp3" required={!sound} />
        {sound && (
          <>
            <input type="hidden" name="existing_audio_url" value={sound.audio_url} />
            <p className="text-xs text-muted-foreground">Leave blank to keep existing audio</p>
          </>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Categories</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                name="categories"
                value={cat.id}
                defaultChecked={selectedCategoryIds.includes(cat.id)}
                className="rounded"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={defaultTags}
          placeholder="funny, bollywood, dialogue (comma separated)"
        />
        <p className="text-xs text-muted-foreground">Comma-separated. Created automatically if they don&apos;t exist.</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : sound ? 'Save Changes' : 'Add Sound'}
        </Button>
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
