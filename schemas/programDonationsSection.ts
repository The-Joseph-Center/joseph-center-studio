import { defineType, defineField } from 'sanity';

// Standalone version of the donations section for use as a page section
// via sectionMap. Program pages embed the same shape directly on the
// program document (see program.ts → donationsSection).
export default defineType({
  name: 'programDonationsSection',
  title: 'Program Donations Section',
  type: 'object',
  fields: [
    defineField({ name: 'programName', title: 'Banner program name', type: 'string' }),
    defineField({
      name: 'sponsorCard',
      title: 'Sponsor an Event card',
      type: 'object',
      fields: [
        defineField({ name: 'enabled', title: 'Show this card', type: 'boolean', initialValue: true }),
        defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Sponsor an Event' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
        defineField({ name: 'buttonLabel', title: 'Button label', type: 'string', initialValue: 'Contact Us' }),
        defineField({ name: 'buttonHref', title: 'Button link', type: 'string', initialValue: '/contact' }),
      ],
    }),
    defineField({
      name: 'donateCard',
      title: 'Donate Supplies card',
      type: 'object',
      fields: [
        defineField({ name: 'enabled', title: 'Show this card', type: 'boolean', initialValue: true }),
        defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Donate Supplies' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
        defineField({ name: 'buttonLabel', title: 'Button label', type: 'string', initialValue: 'Give' }),
        defineField({ name: 'buttonHref', title: 'Button link', type: 'string', initialValue: '/donate' }),
      ],
    }),
  ],
  preview: {
    select: { name: 'programName' },
    prepare: ({ name }: { name?: string }) => ({
      title: name ? `${name} Donations` : 'Program Donations',
    }),
  },
});
