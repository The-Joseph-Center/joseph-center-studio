import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'footerColumns',
  title: 'Footer Columns',
  type: 'document',
  fields: [
    defineField({
      name: 'columns',
      title: 'Column groups with title and links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({ name: 'title', title: 'Column Title', type: 'string' }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'navLink',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                    defineField({ name: 'url', title: 'URL', type: 'string' }),
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'url' },
                    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
                      return {
                        title: title || 'Untitled link',
                        subtitle: subtitle || 'No URL',
                      };
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'title', links: 'links' },
            prepare({ title, links }: { title?: string; links?: unknown[] }) {
              const count = Array.isArray(links) ? links.length : 0;
              return {
                title: title || 'Untitled column',
                subtitle: `${count} ${count === 1 ? 'link' : 'links'}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      c0: 'columns.0.title',
      c1: 'columns.1.title',
      c2: 'columns.2.title',
      c3: 'columns.3.title',
      columns: 'columns',
    },
    prepare({
      c0,
      c1,
      c2,
      c3,
      columns,
    }: {
      c0?: string;
      c1?: string;
      c2?: string;
      c3?: string;
      columns?: unknown[];
    }) {
      const count = Array.isArray(columns) ? columns.length : 0;
      const titles = [c0, c1, c2, c3].filter(Boolean) as string[];
      const subtitle = titles.length
        ? `${count} ${count === 1 ? 'column' : 'columns'}: ${titles.join(' · ')}${count > titles.length ? ' · …' : ''}`
        : `${count} ${count === 1 ? 'column' : 'columns'}`;
      return { title: 'Footer Columns', subtitle };
    },
  },
});
