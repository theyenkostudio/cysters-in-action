import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

export function NewsletterConfirmationEmail({ firstName }: { firstName?: string }) {
  return (
    <Html>
      <Head />
      <Preview>You&rsquo;re on the list — Cysters In Action</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#FDFDF8', padding: '32px' }}>
        <Container style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px' }}>
          <Heading style={{ color: '#134D64' }}>
            Welcome{firstName ? `, ${firstName}` : ''}.
          </Heading>
          <Text>
            Thanks for subscribing to the Cysters In Action newsletter. Depending on your email
            provider’s settings, you may be asked to confirm your subscription — check your inbox
            for that message too.
          </Text>
          <Text style={{ color: '#5F565E', fontSize: '13px' }}>
            Cysters In Action · You can unsubscribe at any time from any newsletter email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
