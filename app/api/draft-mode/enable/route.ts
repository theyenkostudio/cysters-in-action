import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { draftClient } from '@/lib/sanity/client'

export const { GET } = defineEnableDraftMode({
  client: draftClient.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
})
