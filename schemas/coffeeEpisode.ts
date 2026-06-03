import { defineType, defineField } from 'sanity';
import { createElement } from 'react';

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
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      thumbnailUrl: 'thumbnailUrl',
      featured: 'featured',
    },
    prepare({
      title,
      publishedAt,
      thumbnailUrl,
      featured,
    }: {
      title?: string;
      publishedAt?: string;
      thumbnailUrl?: string;
      featured?: boolean;
    }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : null;

      const subtitleParts = [date, featured ? '★ featured' : null].filter(Boolean);

      // The `media` field on a Sanity preview accepts a React node. Building
      // an <img> element from the YouTube CDN URL renders the thumbnail in
      // the doc list view. Falls back to undefined (Studio shows nothing)
      // when the URL hasn't synced yet.
      const media = thumbnailUrl
        ? () =>
            createElement('img', {
              src: thumbnailUrl,
              alt: '',
              style: { width: '100%', height: '100%', objectFit: 'cover' },
            })
        : undefined;

      return {
        title: title || 'Untitled episode',
        subtitle: subtitleParts.join(' · ') || 'Unpublished',
        media,
      };
    },
  },
});
