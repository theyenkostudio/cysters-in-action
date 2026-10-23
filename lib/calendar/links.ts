function toCompactUtc(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
}

export function googleCalendarUrl(event: {
  title: string
  description?: string
  location?: string
  startDateTime: string
  endDateTime: string
}) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toCompactUtc(event.startDateTime)}/${toCompactUtc(event.endDateTime)}`,
    details: event.description ?? '',
    location: event.location ?? '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function outlookCalendarUrl(event: {
  title: string
  description?: string
  location?: string
  startDateTime: string
  endDateTime: string
}) {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: event.startDateTime,
    enddt: event.endDateTime,
    body: event.description ?? '',
    location: event.location ?? '',
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}
