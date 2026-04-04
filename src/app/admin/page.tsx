import { adminDb } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Volume2, TrendingUp, Download, FolderOpen } from 'lucide-react'
import { formatCount } from '@/lib/utils'

async function getStats() {
  const db = adminDb
  const [sounds, categories, topPlayed, topDownloaded] = await Promise.all([
    db.from('sounds').select('count', { count: 'exact', head: true }).eq('is_published', true),
    db.from('categories').select('count', { count: 'exact', head: true }),
    db.from('sounds').select('id, title, play_count').eq('is_published', true).order('play_count', { ascending: false }).limit(5),
    db.from('sounds').select('id, title, download_count').eq('is_published', true).order('download_count', { ascending: false }).limit(5),
  ])
  return {
    totalSounds: sounds.count ?? 0,
    totalCategories: categories.count ?? 0,
    topPlayed: topPlayed.data ?? [],
    topDownloaded: topDownloaded.data ?? [],
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> Total Sounds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCount(stats.totalSounds)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FolderOpen className="w-4 h-4" /> Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalCategories}</p>
          </CardContent>
        </Card>
      </div>

      {/* Top sounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Top Played
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.topPlayed.map((s, i) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground w-4">{i + 1}.</span>
                  <span className="flex-1 truncate mx-2">{s.title}</span>
                  <span className="font-medium tabular-nums">{formatCount(s.play_count)}</span>
                </li>
              ))}
              {stats.topPlayed.length === 0 && <li className="text-sm text-muted-foreground">No data yet</li>}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4" /> Top Downloaded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.topDownloaded.map((s, i) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground w-4">{i + 1}.</span>
                  <span className="flex-1 truncate mx-2">{s.title}</span>
                  <span className="font-medium tabular-nums">{formatCount(s.download_count)}</span>
                </li>
              ))}
              {stats.topDownloaded.length === 0 && <li className="text-sm text-muted-foreground">No data yet</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
