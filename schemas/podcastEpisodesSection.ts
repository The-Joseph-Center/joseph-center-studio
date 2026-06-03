import { defineType, defineField } from 'sanity';

// Section that renders Coffee Chat episodes. Fetches all coffeeEpisode docs
// and shows a featured-episode hero + a grid of remaining episodes.
export default defineType({
  name: 'podcastEpisodesSection',
  title: 'Podcast Episodes Section',
  type: 'object',
  fields: [
    defineField({
      name: 'seriesTitle',
      title: 'Series title',
      type: 'string',
      initialValue: 'Coffee Chat with Mona',
    }),
    defineField({
      name: 'seriesDescription',
      title: 'Series description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'seriesTitle' },
    prepare: ({ title }: { title?: string }) => ({
      title: title || 'Podcast Episodes',
    }),
  },
});
