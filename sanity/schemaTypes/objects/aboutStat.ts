import { defineField, defineType } from 'sanity'

/**
 * Stat shown in a white card in `aboutIntroBlock`'s right column. Distinct
 * from the generic `stat` object (still used by `statsBlock` elsewhere) —
 * this one has `decimals`/`unitSuffix`/`plusSign` so the number, unit and
 * superscript "+" can be styled and animated separately (see
 * components/blocks/about-intro-block.tsx), and a required `source`.
 */
export const aboutStat = defineType({
  name: 'aboutStat',
  title: 'About stat',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'number',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'decimals',
      title: 'Decimal places',
      type: 'number',
      description: 'How many decimal places to show while counting up, e.g. 1 for "1.2".',
      options: { list: [0, 1, 2] },
      initialValue: 0,
      validation: (r) => r.min(0).max(2),
    }),
    defineField({
      name: 'unitSuffix',
      title: 'Unit suffix',
      type: 'string',
      description:
        'Shown at full size right after the number, e.g. "M", "K". Leave blank for none.',
    }),
    defineField({
      name: 'plusSign',
      title: 'Show "+"',
      type: 'boolean',
      description: 'Renders a small superscript "+" after the unit, e.g. "1.2M⁺".',
      initialValue: false,
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (r) => r.required().max(32),
    }),
    defineField({
      name: 'source',
      title: 'Source (internal)',
      type: 'string',
      description:
        'Internal note only — where this figure comes from. Never shown publicly, but required before publishing so every number stays verifiable.',
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((value) => {
          if (typeof value === 'string' && /placeholder/i.test(value)) {
            return 'This still reads like placeholder text — confirm the real source before publishing.'
          }
          return true
        }).warning(),
      ],
    }),
  ],
  preview: {
    select: { value: 'value', unitSuffix: 'unitSuffix', plusSign: 'plusSign', label: 'label' },
    prepare: ({ value, unitSuffix, plusSign, label }) => ({
      title: `${value ?? ''}${unitSuffix ?? ''}${plusSign ? '+' : ''}`,
      subtitle: label,
    }),
  },
})
