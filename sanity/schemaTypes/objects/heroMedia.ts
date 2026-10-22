import { defineField, defineType } from 'sanity'

export const heroMedia = defineType({
  name: 'heroMedia',
  title: 'Hero media',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required(),
        }),
      ],
      hidden: ({ parent }) => parent?.mediaType !== 'image',
      validation: (r) =>
        r.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined
          if (parent?.mediaType === 'image' && !value) return 'Required when media type is Image'
          return true
        }),
    }),
    defineField({
      name: 'videoFile',
      title: 'Video (MP4)',
      type: 'file',
      options: { accept: 'video/mp4' },
      description: 'Keep to ~15 MB / 10–15s loop, 1080p max. Use the Mux plugin for longer video.',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoWebm',
      title: 'Video (WebM, optional)',
      type: 'file',
      options: { accept: 'video/webm' },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Shown before the video loads and when video is disabled (reduced motion, Save-Data).',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      validation: (r) =>
        r.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined
          if (parent?.mediaType === 'video' && !value) return 'Required when media type is Video'
          return true
        }),
    }),
    defineField({
      name: 'captionsFile',
      title: 'Captions (.vtt)',
      type: 'file',
      options: { accept: '.vtt' },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'autoplayMuted',
      title: 'Autoplay muted',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
  ],
})
