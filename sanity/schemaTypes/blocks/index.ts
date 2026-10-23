import type { SchemaTypeDefinition } from 'sanity'
import { ctaBlock } from './ctaBlock'
import { faqBlock } from './faqBlock'
import { featuredArticlesBlock } from './featuredArticlesBlock'
import { formBlock } from './formBlock'
import { heroBlock } from './heroBlock'
import { imageTextBlock } from './imageTextBlock'
import { logoCloudBlock } from './logoCloudBlock'
import { mediaBlock } from './mediaBlock'
import { missionStatementBlock } from './missionStatementBlock'
import { newsletterBlock } from './newsletterBlock'
import { pillarsBlock } from './pillarsBlock'
import { problemSolutionBlock } from './problemSolutionBlock'
import { richTextBlock } from './richTextBlock'
import { statsBlock } from './statsBlock'
import { teamGridBlock } from './teamGridBlock'
import { testimonialBlock } from './testimonialBlock'

export const blockSchemaTypes: SchemaTypeDefinition[] = [
  heroBlock,
  missionStatementBlock,
  pillarsBlock,
  statsBlock,
  problemSolutionBlock,
  featuredArticlesBlock,
  ctaBlock,
  richTextBlock,
  imageTextBlock,
  mediaBlock,
  faqBlock,
  teamGridBlock,
  logoCloudBlock,
  testimonialBlock,
  newsletterBlock,
  formBlock,
]

/** Reusable `of` array for every `sections` (page-builder) field. */
export const pageBuilderOf = blockSchemaTypes.map((block) => ({ type: block.name }))
