import type { PageBuilderBlock } from '@/lib/sanity/types'
import { CtaBlock, type CtaBlockData } from './cta-block'
import { FaqBlock } from './faq-block'
import type { FaqItemValue } from '@/lib/sanity/types'
import { FeaturedArticlesBlock, type FeaturedArticlesData } from './featured-articles-block'
import { HeroBlock } from './hero-block'
import { ImageTextBlock, type ImageTextData } from './image-text-block'
import { LogoCloudBlock, type LogoCloudData } from './logo-cloud-block'
import { MediaBlock } from './media-block'
import { MissionStatementBlock, type MissionStatementData } from './mission-statement-block'
import { PillarsBlock, type PillarsBlockData } from './pillars-block'
import { ProblemSolutionBlock, type ProblemSolutionData } from './problem-solution-block'
import { RichTextBlock } from './rich-text-block'
import { StatsBlock, type StatsBlockData } from './stats-block'
import { TeamGridBlock, type TeamGridData } from './team-grid-block'
import { TestimonialBlock } from './testimonial-block'
import type { HeroValue, HeroMediaValue, RichTextValue, TestimonialRef } from '@/lib/sanity/types'

export function BlockRenderer({ sections }: { sections?: PageBuilderBlock[] }) {
  if (!sections || sections.length === 0) return null

  return (
    <>
      {sections.map((block) => {
        switch (block._type) {
          case 'heroBlock':
            return (
              <HeroBlock
                key={block._key}
                data={
                  block as unknown as {
                    hero?: HeroValue
                    animation?: 'none' | 'subtle' | 'exaggerated'
                  }
                }
              />
            )
          case 'missionStatementBlock':
            return (
              <MissionStatementBlock
                key={block._key}
                data={block as unknown as MissionStatementData}
              />
            )
          case 'pillarsBlock':
            return <PillarsBlock key={block._key} data={block as unknown as PillarsBlockData} />
          case 'statsBlock':
            return <StatsBlock key={block._key} data={block as unknown as StatsBlockData} />
          case 'problemSolutionBlock':
            return (
              <ProblemSolutionBlock
                key={block._key}
                data={block as unknown as ProblemSolutionData}
              />
            )
          case 'featuredArticlesBlock':
            return (
              <FeaturedArticlesBlock
                key={block._key}
                data={block as unknown as FeaturedArticlesData}
              />
            )
          case 'ctaBlock':
            return <CtaBlock key={block._key} data={block as unknown as CtaBlockData} />
          case 'richTextBlock':
            return (
              <RichTextBlock
                key={block._key}
                data={block as unknown as { content: RichTextValue; width?: 'narrow' | 'wide' }}
              />
            )
          case 'imageTextBlock':
            return <ImageTextBlock key={block._key} data={block as unknown as ImageTextData} />
          case 'mediaBlock':
            return (
              <MediaBlock
                key={block._key}
                data={
                  block as unknown as {
                    heroMedia?: HeroMediaValue
                    caption?: string
                    fullBleed?: boolean
                  }
                }
              />
            )
          case 'faqBlock':
            return (
              <FaqBlock
                key={block._key}
                data={block as unknown as { heading?: string; items: FaqItemValue[] }}
              />
            )
          case 'teamGridBlock':
            return <TeamGridBlock key={block._key} data={block as unknown as TeamGridData} />
          case 'logoCloudBlock':
            return <LogoCloudBlock key={block._key} data={block as unknown as LogoCloudData} />
          case 'testimonialBlock':
            return (
              <TestimonialBlock
                key={block._key}
                data={block as unknown as { testimonials: TestimonialRef[] }}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
