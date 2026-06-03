import { defineType, defineField } from 'sanity';

// Embeddable Stay Connected (newsletter + SMS opt-in) section. Renders
// inline on any page where editors want a subscribe CTA.
export default defineType({
  name: 'stayConnectedSection',
  title: 'Stay Connected Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Stay Connected',
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'White (page bg)', value: 'white' },
          { title: 'Cream', value: 'cream' },
          { title: 'Deep Green', value: 'deep-green' },
        ],
        layout: 'radio',
      },
      initialValue: 'cream',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }: { title?: string }) => ({
      title: title || 'Stay Connected',
    }),
  },
});
