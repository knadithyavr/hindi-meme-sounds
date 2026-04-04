import Link from 'next/link'
import { adminDb } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { formatCount } from '@/lib/utils'
import { DeleteSoundButton, TogglePublishButton } from './SoundActions'

async function getSoundsAdmin() {
  const db = adminDb
  const { data } = await db
    .from('sounds')
    .select('id, title, slug, play_count, download_count, share_count, is_published, created_at')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminSoundsPage() {
  const sounds = await getSoundsAdmin()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Sounds ({sounds.length})</h1>
        <Link href="/admin/sounds/new">
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Sound</Button>
        </Link>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Plays</TableHead>
              <TableHead className="text-right">Downloads</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sounds.map(sound => (
              <TableRow key={sound.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{sound.title}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCount(sound.play_count)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCount(sound.download_count)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCount(sound.share_count)}</TableCell>
                <TableCell>
                  <Badge variant={sound.is_published ? 'default' : 'secondary'}>
                    {sound.is_published ? 'Published' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <TogglePublishButton id={sound.id} isPublished={sound.is_published} />
                    <Link href={`/admin/sounds/${sound.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <DeleteSoundButton id={sound.id} title={sound.title} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {sounds.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No sounds yet. <Link href="/admin/sounds/new" className="text-primary underline">Add one.</Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
