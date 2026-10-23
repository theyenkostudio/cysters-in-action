import { StoriesCarousel } from '@/components/connect/stories-carousel'
import { stories } from '@/lib/sanity/fixtures/stories'

/** Moment 5 in isolation, using the same real StoriesCarousel component the
 * site uses — fed the placeholder fixture stories (not live data) since this
 * page is a motion sign-off tool, not a content page. */
export function StoriesCarouselDemo() {
  return <StoriesCarousel stories={stories} exaggerated />
}
