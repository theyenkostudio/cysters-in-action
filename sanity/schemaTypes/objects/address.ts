import { defineField, defineType } from 'sanity'

export const address = defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    defineField({ name: 'organisationName', title: 'Organisation name', type: 'string' }),
    defineField({ name: 'line1', title: 'Address line 1', type: 'string' }),
    defineField({ name: 'line2', title: 'Address line 2', type: 'string' }),
    defineField({ name: 'city', title: 'City', type: 'string' }),
    defineField({ name: 'region', title: 'Region / state', type: 'string' }),
    defineField({ name: 'postalCode', title: 'Postal code', type: 'string' }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({
      name: 'digitalAddress',
      title: 'Digital address',
      type: 'string',
      description: 'e.g. Ghana Post GPS. Optional.',
    }),
    defineField({ name: 'mapUrl', title: 'Map URL', type: 'url' }),
  ],
})
