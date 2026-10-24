import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

export function EventReminderEmail({
  name,
  eventTitle,
  startDateTime,
  timezone,
  joinUrl,
  venueName,
  hoursBefore,
}: {
  name: string
  eventTitle: string
  startDateTime: string
  timezone: string
  joinUrl?: string
  venueName?: string
  hoursBefore: 24 | 1
}) {
  const formatted = new Date(startDateTime).toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: timezone,
  })
  const whenText = hoursBefore === 24 ? 'tomorrow' : 'in about an hour'

  return (
    <Html>
      <Head />
      <Preview>{`${eventTitle} is ${whenText}`}</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#FDFDF8', padding: '32px' }}>
        <Container style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px' }}>
          <Heading style={{ color: '#134D64' }}>Hi {name}, this is a reminder</Heading>
          <Text>
            <strong>{eventTitle}</strong> is {whenText}.
            <br />
            {formatted} ({timezone})
            {venueName && (
              <>
                <br />
                {venueName}
              </>
            )}
          </Text>
          {joinUrl && (
            <Text>
              Join link: <a href={joinUrl}>{joinUrl}</a>
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  )
}
