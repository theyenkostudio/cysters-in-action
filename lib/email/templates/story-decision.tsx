import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

export function StoryDecisionEmail({
  name,
  decision,
  storyUrl,
}: {
  name?: string
  decision: 'approved' | 'rejected'
  storyUrl?: string
}) {
  return (
    <Html>
      <Head />
      <Preview>
        {decision === 'approved' ? 'Your story is live' : 'An update on your story'}
      </Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#FDFDF8', padding: '32px' }}>
        <Container style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px' }}>
          <Heading style={{ color: '#134D64' }}>Hi{name ? ` ${name}` : ''},</Heading>
          {decision === 'approved' ? (
            <Text>
              Your story has been approved and is now live on the Community stories page.
              {storyUrl && (
                <>
                  {' '}
                  You can read it here: <a href={storyUrl}>{storyUrl}</a>.
                </>
              )}
            </Text>
          ) : (
            <Text>
              After review, we’re not able to publish your story as submitted. This doesn’t reflect
              on you or your experience — if you’d like to know more, you’re welcome to reach out.
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  )
}
