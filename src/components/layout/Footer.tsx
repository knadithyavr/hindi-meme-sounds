import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 text-sm">
          <span className="text-primary font-medium">हिंदी</span>
          <span className="text-muted-foreground"> Meme Studio © {new Date().getFullYear()}</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}
