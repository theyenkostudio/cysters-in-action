import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

export function ContactAutoReplyEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>We got your message — Cysters In Action</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#FDFDF8', padding: '32px' }}>
        <Container style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px' }}>
          <Heading style={{ color: '#134D64' }}>Thanks, {name}.</Heading>
          <Text>
            We’ve received your message and will get back to you as soon as we can. If it’s urgent,
            please say so and we’ll try to prioritise accordingly.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
