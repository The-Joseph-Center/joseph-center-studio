import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'videoSection',
  title: 'Video Section',
  type: 'object',
  fields: [
    defineField({
      name: 'introText',
      title: 'Intro text',
      description: 'Shown in italics above the video.',
      type: 'string',
    }),
    defineField({
      name: 'videoId',
      title: 'YouTube video ID',
      description: 'The ID from the YouTube URL (e.g. "dQw4w9WgXcQ"). Leave blank to show a placeholder.',
      type: 'string',
    }),
    defineField({
      name: 'placeholderLabel',
      title: 'Placeholder label',
      description: 'Shown when no video ID is set.',
      type: 'string',
      initialValue: 'Video coming soon',
    }),
  ],
  preview: {
    select: { intro: 'introText', id: 'videoId' },
    prepare: ({ intro, id }: { intro?: string; id?: string }) => ({
      title: intro || 'Video Section',
      subtitle: id ? `ID: ${id}` : 'No video — placeholder shown',
    }),
  },
});
