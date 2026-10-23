import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

export function RsvpConfirmationEmail({
  name,
  eventTitle,
  startDateTime,
  timezone,
  joinUrl,
  venueName,
  waitlisted,
}: {
  name: string
  eventTitle: string
  startDateTime: string
  timezone: string
  joinUrl?: string
  venueName?: string
  waitlisted?: boolean
}) {
  const formatted = new Date(startDateTime).toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: timezone,
  })

  return (
    <Html>
      <Head />
      <Preview>
        {waitlisted
          ? `You're on the waitlist for ${eventTitle}`
          : `You're confirmed for ${eventTitle}`}
      </Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#FDFDF8', padding: '32px' }}>
        <Container style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px' }}>
          <Heading style={{ color: '#134D64' }}>
            {waitlisted ? `Hi ${name}, you're on the waitlist` : `You're confirmed, ${name}`}
          </Heading>
          <Text>
            <strong>{eventTitle}</strong>
            <br />
            {formatted} ({timezone})
            {venueName && (
              <>
                <br />
                {venueName}
              </>
            )}
          </Text>
          {waitlisted ? (
            <Text>This event is at capacity. We’ll email you if a spot opens up.</Text>
          ) : (
            <>
              {joinUrl && (
                <Text>
                  Join link: <a href={joinUrl}>{joinUrl}</a>
                </Text>
              )}
              <Text>
                A calendar file (.ics) is attached — add it to Google, Outlook or Apple Calendar.
              </Text>
            </>
          )}
        </Container>
      </Body>
    </Html>
  )
}
