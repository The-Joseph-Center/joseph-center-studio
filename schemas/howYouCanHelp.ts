import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'howYouCanHelp',
  title: 'How You Can Help',
  type: 'object',
  fields: [
    defineField({
      name: 'personDescriptor',
      title: 'Person descriptor',
      description: 'Used in "You can help X for as little as $25/month." e.g. "a Golden Girl", "a family".',
      type: 'string',
      initialValue: 'someone in need',
    }),
  ],
  preview: {
    select: { person: 'personDescriptor' },
    prepare({ person }: { person?: string }) {
      return { title: 'How You Can Help', subtitle: person ? `for ${person}` : 'donor appeal' };
    },
  },
});
