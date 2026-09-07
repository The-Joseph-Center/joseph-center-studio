import { defineType, defineField } from 'sanity';

// One slice of a transparency chart. Shared by both charts on /transparency —
// where support comes from, and where it goes — so the two cannot drift apart
// in what they store or how they preview.
export default defineType({
  name: 'allocation',
  title: 'Category',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Category',
      description: 'e.g. "Programs & Services", "Administration", "Fundraising"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Amount or percentage',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'note',
      title: 'Short note (optional)',
      description: 'One short line shown under the category in the key, e.g. "Food, shelter, case management".',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'value' },
    prepare: ({ title, subtitle }: { title?: string; subtitle?: number }) => ({
      title: title || 'Untitled category',
      subtitle: subtitle != null ? String(subtitle) : 'No value',
    }),
  },
});
