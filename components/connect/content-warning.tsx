'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ContentWarning({
  warning,
  children,
}: {
  warning: string
  children: React.ReactNode
}) {
  const [revealed, setRevealed] = useState(false)

  if (revealed) return <>{children}</>

  return (
    <div className="rounded-card border-default bg-muted border p-6 text-center">
      <p className="text-fg text-sm font-medium">Content warning: {warning}</p>
      <Button type="button" variant="outline" className="mt-4" onClick={() => setRevealed(true)}>
        Show story anyway
      </Button>
    </div>
  )
}
