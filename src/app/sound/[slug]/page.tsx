import { notFound, redirect } from 'next/navigation'
import { getSoundBySlug } from '@/lib/actions'

interface Props { params: Promise<{ slug: string }> }

// Redirect legacy /sound/[slug] links to /[lang]/sound/[slug]
export default async function SoundRedirectPage({ params }: Props) {
  const { slug } = await params
  const sound = await getSoundBySlug(slug)
  if (!sound || !sound.language_slug) notFound()
  redirect(`/${sound.language_slug}/sound/${sound.slug}`)
}
