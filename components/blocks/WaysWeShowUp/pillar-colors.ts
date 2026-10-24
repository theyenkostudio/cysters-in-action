import type { PillarKey } from '@/lib/sanity/types'

/** Text-safe colour per pillar (theme.config.ts `pillars`: learn=teal, connect=orchid, act=lagoon). */
export const PILLAR_TEXT_VAR: Record<PillarKey, string> = {
  learn: 'var(--color-fg-heading)',
  connect: 'var(--color-orchid-text)',
  act: 'var(--color-lagoon-text)',
}

/** Solid/vivid step per pillar — decorative-only, same steps documented as
 * non-text in theme/contrast.test.ts (the sticker fill, never text). */
export const PILLAR_SOLID_VAR: Record<PillarKey, string> = {
  learn: 'var(--teal-700)',
  connect: 'var(--orchid-500)',
  act: 'var(--lagoon-500)',
}
