import { defineType, defineField } from 'sanity';

// Portable-text narrative wrapped in a DiagonalSection band (e.g. the
// "OUR STORY" founding-story block on /our-story). Reuses the existing
// DiagonalSection.vue wrapper visually.
export default defineType({
  name: 'diagonalTextSection',
  title: 'Diagonal Text Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Band title',
      description: 'Shown in uppercase on the diagonal band, e.g. "OUR STORY".',
      type: 'string',
    }),
    defineField({
      name: 'color',
      title: 'Band color',
      type: 'string',
      options: {
        list: [
          { title: 'Gold', value: 'gold' },
          { title: 'Green', value: 'green' },
          { title: 'Deep Green', value: 'deep-green' },
        ],
        layout: 'radio',
      },
      initialValue: 'gold',
    }),
    defineField({
      name: 'body',
      title: 'Body content',
      description: 'Rich text rendered inside the diagonal band.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'title', color: 'color' },
    prepare: ({ title, color }: { title?: string; color?: string }) => ({
      title: title || 'Diagonal Text',
      subtitle: color ? `${color} band` : 'gold band',
    }),
  },
});
