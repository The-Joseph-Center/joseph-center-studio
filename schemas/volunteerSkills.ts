import { defineType, defineField } from 'sanity';

// Singleton config doc — drives the "Skills Volunteer" checkbox list on the
// volunteer form. Editors can rename categories, add or remove skills, and
// reorder, all without a code change.
export default defineType({
  name: 'volunteerSkills',
  title: 'Volunteer Skills',
  type: 'document',
  fields: [
    defineField({
      name: 'categories',
      title: 'Skill Categories',
      description:
        'Each category groups related skills as a header on the form. Reorder to control display order.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'skillCategory',
          fields: [
            defineField({
              name: 'name',
              title: 'Category name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'active',
              title: 'Show on the volunteer form',
              description:
                'Uncheck to hide this category from the form without losing the skill list — handy when a category is paused but might come back.',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'skills',
              title: 'Skills',
              description: 'One label per row. Shown as checkboxes under this category.',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.min(1),
            }),
          ],
          preview: {
            select: { title: 'name', skills: 'skills', active: 'active' },
            prepare({ title, skills, active }: { title?: string; skills?: string[]; active?: boolean }) {
              const count = Array.isArray(skills) ? skills.length : 0;
              const status = active === false ? ' · hidden' : '';
              return {
                title: title || 'Untitled category',
                subtitle: `${count} skill${count === 1 ? '' : 's'}${status}`,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Volunteer Skills', subtitle: 'Singleton config' };
    },
  },
});
