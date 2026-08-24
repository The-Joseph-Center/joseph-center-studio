import { defineType, defineField } from 'sanity';

// Section that renders all documents of a given type (staff or board) as a
// 2-column photo grid. Used by /staff and /board pages.
export default defineType({
  name: 'peopleGrid',
  title: 'People Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'source',
      title: 'People source',
      description: 'Which document type to query',
      type: 'string',
      options: {
        list: [
          { title: 'Staff', value: 'staff' },
          { title: 'Board', value: 'board' },
        ],
        layout: 'radio',
      },
      initialValue: 'staff',
    }),
    defineField({
      name: 'groupByDepartment',
      title: 'Group staff by department',
      description:
        'Splits the grid into department sections, each with its own heading and rule. Staff only — board members have no departments, so this has no effect on a board grid. Anyone with no department (or marked "Unknown / Needs Review") is listed under "Additional Staff" at the end.',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }: { parent?: { source?: string } }) => parent?.source === 'board',
    }),
    defineField({
      name: 'showContact',
      title: 'Show contact links',
      description: 'Uncheck to hide "Contact [name] →" links (typical for board pages).',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { source: 'source' },
    prepare: ({ source }: { source?: string }) => ({
      title: 'People Grid',
      subtitle: source ? `Source: ${source}` : 'Source: staff',
    }),
  },
});
