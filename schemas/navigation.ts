import { defineType, defineField } from 'sanity';
import { MdMenu } from 'react-icons/md';

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MdMenu,
  fields: [
    defineField({
      name: 'items',
      title: 'Top-level menu items. Items with children render as accordion sections; items without render as direct links.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
            }),
            defineField({
              name: 'isExternal',
              title: 'External link',
              type: 'boolean',
            })
          ],
        }
      ],
      validation: Rule => Rule.required(),
    }),
  ],
});
