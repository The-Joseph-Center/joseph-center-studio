import { defineType, defineField } from 'sanity';

// Section for the /transparency page. Fetches all annualReport documents and
// renders them as a downloadable list.
export default defineType({
  name: 'transparencySection',
  title: 'Transparency Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Banner heading',
      type: 'string',
      initialValue: 'Transparency',
    }),
    defineField({
      name: 'intro',
      title: 'Intro text',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }: { title?: string }) => ({
      title: title || 'Transparency Section',
    }),
  },
});
