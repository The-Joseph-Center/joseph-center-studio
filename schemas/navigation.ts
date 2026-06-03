import { defineType, defineField } from 'sanity';
import { MdMenu } from 'react-icons/md';

const NAV_TYPE_LABELS: Record<string, string> = {
  main: 'Main / Header',
  footer: 'Footer',
  legal: 'Legal (privacy, terms, accessibility)',
};

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MdMenu,
  fields: [
    defineField({
      name: 'navType',
      title: 'Where this menu appears',
      description: 'Choose which area of the site this navigation feeds.',
      type: 'string',
      options: {
        list: [
          { title: 'Main / Header', value: 'main' },
          { title: 'Footer', value: 'footer' },
          { title: 'Legal (privacy, terms, accessibility)', value: 'legal' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Menu items',
      description:
        'Top-level menu items. Items with children render as accordion sections; items without render as direct links.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'string' }),
            defineField({ name: 'isExternal', title: 'External link', type: 'boolean' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url', external: 'isExternal' },
            prepare({
              title,
              subtitle,
              external,
            }: {
              title?: string;
              subtitle?: string;
              external?: boolean;
            }) {
              return {
                title: title || 'Untitled item',
                subtitle: `${subtitle || 'No URL'}${external ? ' · external' : ''}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { navType: 'navType', items: 'items' },
    prepare({ navType, items }: { navType?: string; items?: unknown[] }) {
      const count = Array.isArray(items) ? items.length : 0;
      const label = navType ? NAV_TYPE_LABELS[navType] || navType : 'Untitled navigation';
      return {
        title: label,
        subtitle: `${count} ${count === 1 ? 'item' : 'items'}`,
      };
    },
  },
});
