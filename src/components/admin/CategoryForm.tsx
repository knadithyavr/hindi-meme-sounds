'use client'

import { useTransition, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Category } from '@/types'

const GRADIENT_OPTIONS = [
  { label: 'Pink → Purple', value: 'from-pink-500 to-purple-600' },
  { label: 'Blue → Cyan', value: 'from-blue-500 to-cyan-400' },
  { label: 'Green → Emerald', value: 'from-green-500 to-emerald-400' },
  { label: 'Orange → Amber', value: 'from-orange-500 to-amber-400' },
  { label: 'Red → Pink', value: 'from-red-500 to-pink-500' },
  { label: 'Violet → Indigo', value: 'from-violet-500 to-indigo-500' },
  { label: 'Teal → Green', value: 'from-teal-500 to-green-400' },
  { label: 'Yellow → Orange', value: 'from-yellow-500 to-orange-400' },
  { label: 'Fuchsia → Pink', value: 'from-fuchsia-500 to-pink-400' },
  { label: 'Sky → Blue', value: 'from-sky-500 to-blue-400' },
]

interface CategoryFormProps {
  category?: Category
  action: (formData: FormData) => Promise<void | { error: string }>
}

export function CategoryForm({ category, action }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [color, setColor] = useState(category?.color ?? GRADIENT_OPTIONS[0].value)

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
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" name="name" required defaultValue={category?.name} placeholder="Bollywood Classics" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={category?.description ?? ''} rows={2} />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {GRADIENT_OPTIONS.map(opt => (
            <label key={opt.value} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={opt.value}
                checked={color === opt.value}
                onChange={() => setColor(opt.value)}
                className="sr-only"
              />
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${opt.value} ring-offset-2 ring-offset-background ${color === opt.value ? 'ring-2 ring-primary' : ''}`}
                title={opt.label}
              />
            </label>
          ))}
        </div>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color}`} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : category ? 'Save Changes' : 'Add Category'}
        </Button>
        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
      </div>
    </form>
  )
}
