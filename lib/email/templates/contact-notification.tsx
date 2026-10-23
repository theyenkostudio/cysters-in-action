import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

export function ContactNotificationEmail({
  enquiryType,
  name,
  email,
  organisation,
  message,
}: {
  enquiryType: string
  name: string
  email: string
  organisation?: string
  message: string
}) {
  return (
    <Html>
      <Head />
      <Preview>
        New {enquiryType} enquiry from {name}
      </Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#FDFDF8', padding: '32px' }}>
        <Container style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px' }}>
          <Heading style={{ color: '#134D64' }}>New contact form submission</Heading>
          <Text>
            <strong>Type:</strong> {enquiryType}
            <br />
            <strong>Name:</strong> {name}
            <br />
            <strong>Email:</strong> {email}
            <br />
            {organisation && (
              <>
                <strong>Organisation:</strong> {organisation}
                <br />
              </>
            )}
          </Text>
          <Text style={{ whiteSpace: 'pre-wrap' }}>{message}</Text>
        </Container>
      </Body>
    </Html>
  )
}
