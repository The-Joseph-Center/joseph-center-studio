import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'coffeeEpisode',
  title: 'Coffee Chat Episode',
  type: 'document',
  fields: [
    defineField({ name: 'videoId', title: 'YouTube Video ID', type: 'string', readOnly: true }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', readOnly: true }),
    defineField({ name: 'thumbnailUrl', title: 'Thumbnail URL', type: 'url', readOnly: true }),
    defineField({ name: 'episodeNumber', title: 'Episode Number', type: 'number' }),
    defineField({
      name: 'platforms',
      title: 'Podcast Platforms',
      type: 'array',
      of: [{
        type: 'object',
        name: 'platform',
        fields: [
          defineField({ name: 'name', title: 'Platform Name', type: 'string' }),
          defineField({ name: 'url', title: 'URL', type: 'url' }),
        ],
        preview: { select: { title: 'name', subtitle: 'url' } },
      }],
    }),
    defineField({ name: 'featured', title: 'Featured Episode', type: 'boolean', initialValue: false }),
    defineField({
      name: 'syncedFields',
      title: 'Auto-synced Fields (do not edit manually)',
      description: 'Fields the YouTube sync overwrites daily. Remove a field name here to keep your manual edit.',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
    }),
  ],
  orderings: [
    { title: 'Published, Newest First', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: { select: { title: 'title', subtitle: 'publishedAt', media: 'thumbnailUrl' } },
});
