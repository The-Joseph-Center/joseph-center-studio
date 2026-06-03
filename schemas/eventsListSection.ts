import { defineType, defineField } from 'sanity';

// Section that queries all `events` documents from Sanity and renders them
// as a vertical stack of full-width cards on the /events page.
export default defineType({
  name: 'eventsListSection',
  title: 'Events List Section',
  type: 'object',
  fields: [
    defineField({
      name: 'bannerText',
      title: 'Banner text',
      type: 'string',
      initialValue: 'Join Us at an Upcoming Event',
    }),
    defineField({
      name: 'showPastEvents',
      title: 'Show past events',
      description: 'Check to also display events whose date is already past.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'bannerText' },
    prepare: ({ title }: { title?: string }) => ({ title: title || 'Events List' }),
  },
});
