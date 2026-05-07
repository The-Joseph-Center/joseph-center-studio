import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'annualReport',
  title: 'Annual Report',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(2000).max(2100),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'PDF File',
      type: 'file',
      options: { accept: '.pdf' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],
  orderings: [
    { title: 'Year, Newest First', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: { select: { title: 'title', subtitle: 'year' } },
});
