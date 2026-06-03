import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'dualCtaSection',
  title: 'Dual CTA Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading (optional)', type: 'string' }),
    defineField({ name: 'body', title: 'Body text (optional)', type: 'text', rows: 2 }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'ctaButton',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'href', title: 'Link', type: 'string', validation: (R) => R.required() }),
            defineField({
              name: 'variant',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary (green)', value: 'primary' },
                  { title: 'Secondary (gold)', value: 'secondary' },
                  { title: 'Ghost (outlined)', value: 'ghost' },
                ],
                layout: 'radio',
              },
              initialValue: 'primary',
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'variant' } },
        },
      ],
      validation: (R) => R.max(3),
    }),
  ],
  preview: {
    select: { b0: 'buttons.0.label', b1: 'buttons.1.label' },
    prepare: ({ b0, b1 }: { b0?: string; b1?: string }) => ({
      title: 'Dual CTA',
      subtitle: [b0, b1].filter(Boolean).join(' · ') || 'No buttons',
    }),
  },
});
