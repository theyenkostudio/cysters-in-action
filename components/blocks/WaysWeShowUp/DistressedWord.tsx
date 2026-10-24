/**
 * Shared SVG filter (feTurbulence + feDisplacementMap for a stamped wobble,
 * plus a second turbulence pass punching small speckle holes for ink
 * texture) — defined ONCE and referenced by every card's word via
 * `filter: url(#distressed-ink)`, not duplicated per card.
 */
export function DistressedInkFilterDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
      <defs>
        <filter id="distressed-ink" x="-20%" y="-30%" width="140%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.09"
            numOctaves={2}
            seed={5}
            result="wobble"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="wobble"
            scale={4}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.9}
            numOctaves={2}
            seed={11}
            result="speckleNoise"
          />
          <feColorMatrix
            in="speckleNoise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.6 0.6 0.6 0 -0.35"
            result="speckleAlpha"
          />
          <feComposite in="displaced" in2="speckleAlpha" operator="out" />
        </filter>
      </defs>
    </svg>
  )
}

/**
 * The huge stamped word on each card. Real text (not an image) — bleeds
 * close to the card edges, heaviest available display-font weight (the
 * font only ships 500/700, so "heaviest" is 700/font-bold).
 */
export function DistressedWord({ word }: { word: string }) {
  return (
    <span
      data-distressed-word
      aria-hidden="true"
      className="font-display pointer-events-none block text-center font-bold tracking-[-0.02em] text-balance text-white uppercase"
      style={{
        fontSize: 'clamp(3rem, 14vw, 6.25rem)',
        lineHeight: 0.85,
        filter: 'url(#distressed-ink)',
      }}
    >
      {word}
    </span>
  )
}
