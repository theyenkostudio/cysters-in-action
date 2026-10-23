'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import { googleCalendarUrl, outlookCalendarUrl } from '@/lib/calendar/links'
import type { EventRef } from '@/lib/sanity/types'

export function AddToCalendarMenu({ event }: { event: EventRef }) {
  const location =
    event.format === 'inPerson' || event.format === 'hybrid' ? event.venue?.name : undefined
  const common = {
    title: event.title,
    description: event.summary,
    location,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button type="button" variant="outline">
          Add to calendar
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="rounded-card border-default bg-canvas z-50 min-w-[180px] border p-1 shadow-lg"
          sideOffset={6}
        >
          <DropdownMenu.Item asChild>
            <a
              href={googleCalendarUrl(common)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:bg-muted block rounded-lg px-3 py-2 text-sm"
            >
              Google Calendar
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <a
              href={outlookCalendarUrl(common)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:bg-muted block rounded-lg px-3 py-2 text-sm"
            >
              Outlook
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <a
              href={`/api/ics/${event._id}`}
              className="text-fg hover:bg-muted block rounded-lg px-3 py-2 text-sm"
            >
              Apple / other (.ics)
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
