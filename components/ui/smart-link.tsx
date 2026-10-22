import NextLink from 'next/link'
import type { ReactNode } from 'react'
import { resolveHref, type ResolvedLink } from '@/lib/link'

export function SmartLink({
  link,
  className,
  children,
}: {
  link: ResolvedLink
  className?: string
  children: ReactNode
}) {
  if (!link) return null
  const href = resolveHref(link)

  if (link.type === 'internal') {
    return (
      <NextLink href={href} className={className}>
        {children}
      </NextLink>
    )
  }

  return (
    <a
      href={href}
      className={className}
      target={link.openInNewTab ? '_blank' : undefined}
      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}
