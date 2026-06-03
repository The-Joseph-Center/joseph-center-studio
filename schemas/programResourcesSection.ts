import { defineType, defineField } from 'sanity';

// Standalone version of the education & resources section for use as a page
// section via sectionMap. Program pages embed the same shape directly on the
// program document (see program.ts → resourcesSection).
export default defineType({
  name: 'programResourcesSection',
  title: 'Program Resources Section',
  type: 'object',
  fields: [
    defineField({ name: 'programName', title: 'Banner program name', type: 'string' }),
    defineField({
      name: 'learnCard',
      title: 'Learn card',
      type: 'object',
      fields: [
        defineField({ name: 'enabled', title: 'Show this card', type: 'boolean', initialValue: true }),
        defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Learn' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
        defineField({ name: 'buttonLabel', title: 'Button label', type: 'string', initialValue: 'Learn More' }),
        defineField({ name: 'buttonHref', title: 'Button link', type: 'string', initialValue: '/our-story' }),
      ],
    }),
    defineField({
      name: 'resourcesCard',
      title: 'Free Resources card',
      type: 'object',
      fields: [
        defineField({ name: 'enabled', title: 'Show this card', type: 'boolean', initialValue: true }),
        defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Free Resources' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
        defineField({ name: 'buttonLabel', title: 'Button label', type: 'string', initialValue: 'Learn More' }),
        defineField({ name: 'buttonHref', title: 'Button link', type: 'string', initialValue: '/our-story' }),
      ],
    }),
  ],
  preview: {
    select: { name: 'programName' },
    prepare: ({ name }: { name?: string }) => ({
      title: name ? `${name} Education & Resources` : 'Program Resources',
    }),
  },
});
