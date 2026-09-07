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
      of: [{ type: 'allocation' }],
    }),
    // ── Spending chart ──
    // Sources answer "where does the money come from". This answers "where
    // does it go", which is the question a donor is actually asking. Optional:
    // the page renders whichever charts have categories.
    defineField({
      name: 'spendingHeading',
      title: 'Second chart heading',
      type: 'string',
      initialValue: 'Where It Goes',
    }),
    defineField({
      name: 'spendingPeriod',
      title: 'Second chart period',
      description: 'Leave blank to reuse the period above.',
      type: 'string',
    }),
    defineField({
      name: 'spending',
      title: 'Spending categories',
      description:
        'Where the money was spent. Same six-category limit as above, and the same reason.',
      type: 'array',
      validation: (Rule) => Rule.max(6).warning('Six categories is the readable maximum for a pie chart.'),
      of: [{ type: 'allocation' }],
    }),
    defineField({
      name: 'spendingFootnote',
      title: 'Second chart footnote (optional)',
      type: 'string',
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
