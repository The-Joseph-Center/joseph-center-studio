import { defineType, defineField } from 'sanity';

// Section for the /transparency page. Renders a fund-allocation donut chart
// ("where donor funds go") followed by any annualReport documents as a
// downloadable list. The reports list hides itself entirely when there are no
// reports, so the page reads as finished with the chart alone.
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

    // ── Fund allocation chart ──
    defineField({
      name: 'allocationHeading',
      title: 'Chart heading',
      type: 'string',
      initialValue: 'Where Your Gift Goes',
    }),
    defineField({
      name: 'allocationPeriod',
      title: 'Reporting period',
      description:
        'Shown beneath the chart so readers know what the figures cover, e.g. "Fiscal year 2025" or "12 months ending June 2026". Strongly recommended — an allocation chart with no period invites the question.',
      type: 'string',
    }),
    defineField({
      name: 'valueFormat',
      title: 'Figures are',
      description:
        'Percentages or dollar amounts. Either way the chart derives each slice from its share of the total, so the numbers only need to be consistent with each other.',
      type: 'string',
      options: {
        list: [
          { title: 'Percentages', value: 'percent' },
          { title: 'Dollar amounts', value: 'currency' },
        ],
        layout: 'radio',
      },
      initialValue: 'percent',
    }),
    defineField({
      name: 'allocations',
      title: 'Categories',
      description:
        'Where the money goes, as general categories. Ordered largest to smallest automatically. Six at most — beyond that the slices get too thin to read, so roll the small ones into an "Other" category.',
      type: 'array',
      validation: (Rule) => Rule.max(6).warning('Six categories is the readable maximum for a pie chart. Roll the smaller ones into "Other".'),
      of: [
        {
          type: 'object',
          name: 'allocation',
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
        },
      ],
    }),
    defineField({
      name: 'allocationFootnote',
      title: 'Chart footnote (optional)',
      description: 'e.g. "Figures are unaudited." or a source note.',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'heading', allocations: 'allocations' },
    prepare: ({ title, allocations }: { title?: string; allocations?: unknown[] }) => {
      const n = Array.isArray(allocations) ? allocations.length : 0;
      return {
        title: title || 'Transparency Section',
        subtitle: n ? `${n} funding categor${n === 1 ? 'y' : 'ies'}` : 'No funding categories yet',
      };
    },
  },
});
