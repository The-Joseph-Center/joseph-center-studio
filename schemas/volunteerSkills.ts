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
              name: 'skills',
              title: 'Skills',
              description: 'One label per row. Shown as checkboxes under this category.',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.min(1),
            }),
          ],
          preview: {
            select: { title: 'name', skills: 'skills' },
            prepare({ title, skills }: { title?: string; skills?: string[] }) {
              const count = Array.isArray(skills) ? skills.length : 0;
              return {
                title: title || 'Untitled category',
                subtitle: `${count} skill${count === 1 ? '' : 's'}`,
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
