import { Reveal, Stagger } from '@/components/motion/reveal'

export function MythFactList({
  myths,
}: {
  myths: { myth: string; fact: string; sourceUrl?: string }[]
}) {
  return (
    <Stagger className="mt-6 space-y-4">
      {myths.map((item, i) => (
        <Reveal
          key={i}
          className="rounded-card border-default grid gap-3 border p-5 sm:grid-cols-2"
        >
          <div>
            <p className="text-error-text text-xs font-semibold tracking-wide uppercase">Myth</p>
            <p className="text-fg mt-1">{item.myth}</p>
          </div>
          <div>
            <p className="text-success-text text-xs font-semibold tracking-wide uppercase">Fact</p>
            <p className="text-fg mt-1">{item.fact}</p>
            {item.sourceUrl && (
              <a href={item.sourceUrl} className="text-fg-link mt-1 inline-block text-xs underline">
                Source
              </a>
            )}
          </div>
        </Reveal>
      ))}
    </Stagger>
  )
}
