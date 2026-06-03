import { defineType, defineField } from 'sanity';

// Compact teaser surfacing the latest Coffee Chat episode. Embeds on
// content pages (home, our-story, testimonies) to drive traffic to /media
// without duplicating the full PodcastEpisodesSection layout.
export default defineType({
  name: 'latestCoffeeChatSection',
  title: 'Latest Coffee Chat Teaser',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Latest from Coffee Chat with Mona',
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA button label',
      type: 'string',
      initialValue: 'Watch All Episodes →',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }: { title?: string }) => ({
      title: title || 'Latest Coffee Chat Teaser',
    }),
  },
});
