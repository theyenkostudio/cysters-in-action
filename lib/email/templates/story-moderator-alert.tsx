import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

export function StoryModeratorAlertEmail({
  title,
  isAnonymous,
  themes,
}: {
  title: string
  isAnonymous: boolean
  themes: string[]
}) {
  return (
    <Html>
      <Head />
      <Preview>New story submission: {title}</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#FDFDF8', padding: '32px' }}>
        <Container style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px' }}>
          <Heading style={{ color: '#134D64' }}>New story submission</Heading>
          <Text>
            <strong>Title:</strong> {title}
            <br />
            <strong>Anonymous:</strong> {isAnonymous ? 'Yes' : 'No'}
            <br />
            <strong>Themes:</strong> {themes.join(', ') || 'None selected'}
          </Text>
          <Text>Review it in the Stories inbox in Studio.</Text>
        </Container>
      </Body>
    </Html>
  )
}
