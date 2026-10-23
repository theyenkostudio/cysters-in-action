import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'group rounded-card border-default bg-canvas overflow-hidden border transition-transform hover:-translate-y-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardImage({
  src,
  alt,
  sizes = '(min-width: 768px) 33vw, 100vw',
}: {
  src: string
  alt: string
  sizes?: string
}) {
  return (
    <div className="bg-muted relative aspect-[4/3] overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </div>
  )
}
