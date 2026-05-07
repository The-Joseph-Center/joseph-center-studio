import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'startDate', title: 'Start Date', type: 'datetime', validation: (Rule) => Rule.required() }),
    defineField({ name: 'endDate', title: 'End Date', type: 'datetime' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'registration',
      title: 'Event Registration',
      type: 'object',
      fields: [
        defineField({ name: 'enabled', title: 'Registration Open', type: 'boolean', initialValue: false }),
        defineField({ name: 'capacity', title: 'Capacity (max registrants)', type: 'number' }),
        defineField({ name: 'closingDate', title: 'Registration Closes', type: 'datetime' }),
      ],
    }),
  ],
  orderings: [
    { title: 'Start Date, Newest First', name: 'startDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
  preview: { select: { title: 'title', subtitle: 'startDate', media: 'image' } },
});
