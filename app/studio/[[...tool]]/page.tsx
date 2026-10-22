'use client'

// Studio must stay a Client Component: importing sanity.config.ts (and the
// whole `sanity` package) from a Server Component pulls it into the RSC
// module graph, where some of its deps (e.g. swr) only expose the
// "react-server" condition's named exports and break on Studio's default
// import.
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
