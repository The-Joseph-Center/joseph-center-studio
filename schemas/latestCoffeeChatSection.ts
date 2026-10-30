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
    // The guest application was reachable only from the Media page, which asks
    // people to find it after they have already gone looking. The invitation
    // belongs next to the episode that prompts it.
    defineField({
      name: 'showGuestCta',
      title: 'Show the "be a guest" button',
      description:
        'A second button beside the first, linking to the Coffee Chat guest application at /media/apply.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'guestCtaLabel',
      title: '"Be a guest" button label',
      type: 'string',
      initialValue: 'Be a guest on Coffee Chat →',
      hidden: ({ parent }: { parent?: { showGuestCta?: boolean } }) =>
        parent?.showGuestCta === false,
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }: { title?: string }) => ({
      title: title || 'Latest Coffee Chat Teaser',
    }),
  },
});
