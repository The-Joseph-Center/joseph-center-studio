import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'mapEmbedSection',
  title: 'Map Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'embedUrl',
      title: 'Google Maps embed URL',
      description:
        'The URL only (not the full iframe). From Google Maps → Share → Embed a map, copy the value inside src="…". Starts with https://www.google.com/maps/embed?pb=…',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['https'] }).custom((url?: string) =>
          !url || url.startsWith('https://www.google.com/maps/embed')
            ? true
            : 'Must be a Google Maps embed URL (https://www.google.com/maps/embed?…)'
        ),
    }),
    defineField({
      name: 'title',
      title: 'Accessible title',
      description: 'Used by screen readers to describe the embed.',
      type: 'string',
      initialValue: 'Location map',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }: { title?: string }) => ({
      title: title || 'Map Embed',
      subtitle: 'Full-width Google Maps iframe',
    }),
  },
});
