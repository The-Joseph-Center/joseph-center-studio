import { defineType, defineField } from 'sanity';

// Section for the /donate page partnership tier grid.
export default defineType({
  name: 'partnershipSection',
  title: 'Partnership Tiers Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Banner heading',
      type: 'string',
      initialValue: 'Partner With Us',
    }),
    defineField({
      name: 'tiers',
      title: 'Partnership tiers',
      description: 'Leave empty to use the built-in defaults ($50, $100, $250, A-List).',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'partnershipTier',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'badge', title: 'Badge (e.g. "Premium")', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({
              name: 'price',
              title: 'Monthly price',
              description: 'Leave blank for custom / contact tiers like A-List.',
              type: 'number',
            }),
            defineField({ name: 'ctaLabel', title: 'CTA label', type: 'string', initialValue: 'Subscribe' }),
            defineField({ name: 'ctaHref', title: 'CTA link', type: 'string' }),
            defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'price' },
            prepare: ({ title, subtitle }: { title?: string; subtitle?: number }) => ({
              title: title || 'Tier',
              subtitle: typeof subtitle === 'number' ? `$${subtitle}/mo` : 'Custom',
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }: { title?: string }) => ({
      title: title || 'Partnership Tiers',
    }),
  },
});
