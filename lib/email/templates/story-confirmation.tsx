import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

export function StoryConfirmationEmail({
  name,
  withdrawUrl,
}: {
  name?: string
  withdrawUrl: string
}) {
  return (
    <Html>
      <Head />
      <Preview>We got your story — Cysters In Action</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#FDFDF8', padding: '32px' }}>
        <Container style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px' }}>
          <Heading style={{ color: '#134D64' }}>Thank you{name ? `, ${name}` : ''}.</Heading>
          <Text>
            We’ve received your story. A moderator will read it before anything happens with it — we
            don’t publish anything without a real person reviewing it first.
          </Text>
          <Text>
            Changed your mind? You can withdraw your story at any time:{' '}
            <a href={withdrawUrl}>request removal</a>.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
