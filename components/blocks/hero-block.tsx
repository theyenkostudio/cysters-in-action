import { Hero } from './hero'
import type { HeroValue } from '@/lib/sanity/types'

export function HeroBlock({
  data,
}: {
  data: { hero?: HeroValue; animation?: 'none' | 'subtle' | 'exaggerated' }
}) {
  if (!data.hero) return null
  return <Hero data={data.hero} animation={data.animation} />
}
