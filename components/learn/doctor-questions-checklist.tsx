'use client'

import { Button } from '@/components/ui/button'

export function DoctorQuestionsChecklist({
  title,
  questions,
}: {
  title?: string
  questions: { question: string; whyItMatters?: string }[]
}) {
  return (
    <div className="rounded-card border-default mt-6 border p-6 print:border-0">
      <div className="flex items-center justify-between print:hidden">
        {title && <p className="font-display text-fg-heading font-semibold">{title}</p>}
        <Button type="button" variant="outline" onClick={() => window.print()} className="text-xs">
          Print checklist
        </Button>
      </div>
      <ul className="mt-4 space-y-4">
        {questions.map((q, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="border-input mt-1 h-4 w-4 flex-shrink-0 rounded border" />
            <div>
              <p className="text-fg font-medium">{q.question}</p>
              {q.whyItMatters && <p className="text-fg-muted mt-1 text-sm">{q.whyItMatters}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
