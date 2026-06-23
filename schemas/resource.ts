import { defineType, defineField } from 'sanity';
import { HiLink } from 'react-icons/hi2';

// Community resource — external link to an organization or service that JC
// guests / families can use. Surfaced on the central /resources page and
// optionally pinned to one or more program pages via the `programs` array.
export default defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  icon: HiLink,
  fields: [
    defineField({
      name: 'title',
      title: 'Organization / Resource Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'One sentence explaining what this resource offers.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Housing & Shelter',          value: 'housing' },
          { title: 'Food & Nutrition',           value: 'food' },
          { title: 'Legal Aid',                  value: 'legal' },
          { title: 'Medical & Mental Health',    value: 'medical' },
          { title: 'Financial Assistance',       value: 'financial' },
          { title: 'Employment & Job Training',  value: 'employment' },
          { title: 'Family Services',            value: 'family' },
          { title: 'Substance Use & Recovery',   value: 'recovery' },
          { title: 'Transportation',             value: 'transportation' },
          { title: 'ID & Documents',             value: 'documents' },
          { title: 'Native American Resources',  value: 'native-american' },
          { title: 'Community Organizations',    value: 'community' },
          { title: 'Calendars & Events',         value: 'calendars' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'programs',
      title: 'Relevant Programs',
      description: 'Which program pages should also list this resource. Select "All Programs" to pin it to every program. Leave empty to show only on the central /resources page.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Day Shelter',                    value: 'day-shelter' },
          { title: 'Food Pantry',                    value: 'food-pantry' },
          { title: 'Golden Girls Project',           value: 'golden-girls' },
          { title: 'Integrated Financial Services',  value: 'integrated-financial-services' },
          { title: 'Family Center',                  value: 'family-center' },
          { title: 'All Programs',                   value: 'all' },
        ],
        layout: 'tags',
      },
    }),
    defineField({ name: 'phone',   title: 'Phone (optional)',   type: 'string' }),
    defineField({ name: 'address', title: 'Address (optional)', type: 'string' }),
    defineField({
      name: 'featured',
      title: 'Featured Resource',
      description: 'Pinned to the top of its category on the resources page.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      description: 'Uncheck to hide without deleting.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
    { title: 'Title A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', active: 'active' },
    prepare: ({ title, subtitle, active }: { title?: string; subtitle?: string; active?: boolean }) => ({
      title: active === false ? `[Hidden] ${title}` : (title || 'Untitled resource'),
      subtitle,
    }),
  },
});
