import { NextRequest, NextResponse } from 'next/server'
import { buildIcsFile } from '@/lib/calendar/ics'
import { getEventById } from '@/lib/sanity/content'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const event = await getEventById(eventId)

  if (!event) {
    return NextResponse.json({ message: 'Event not found' }, { status: 404 })
  }

  const location =
    event.format === 'inPerson' || event.format === 'hybrid' ? event.venue?.name : 'Online'

  const ics = buildIcsFile({
    title: event.title,
    description: event.summary,
    location,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
  })

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.slug.current}.ics"`,
    },
  })
}
