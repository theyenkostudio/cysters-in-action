import { defineField } from 'sanity'

/** Every page-builder block gets this field (Section 6 conventions). */
export function animationField(options: { exaggerated?: boolean } = {}) {
  const list = options.exaggerated
    ? [
        { title: 'None', value: 'none' },
        { title: 'Subtle', value: 'subtle' },
        { title: 'Exaggerated', value: 'exaggerated' },
      ]
    : [
        { title: 'None', value: 'none' },
        { title: 'Subtle', value: 'subtle' },
      ]

  return defineField({
    name: 'animation',
    title: 'Animation',
    type: 'string',
    options: { list },
    initialValue: 'subtle',
  })
}
