'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import { Music2, LayoutDashboard, Volume2, FolderOpen, LogOut } from 'lucide-react'
import { adminLogout } from '@/lib/admin-actions'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/sounds', label: 'Sounds', icon: Volume2 },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments()
  const isLoginPage = segments[0] === 'login'

  // Login page gets no sidebar — clean slate for the auth form
  if (isLoginPage) return <>{children}</>

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-border bg-card flex flex-col">
        <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
          <Music2 className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">HMS Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex items-center gap-2.5 px-3 py-2 w-full rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
