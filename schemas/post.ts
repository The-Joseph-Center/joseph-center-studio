import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Post title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'postType',
      title: 'Post Type',
      description: 'Newsletter Recap or general Article / Update.',
      type: 'string',
      options: {
        list: [
          { title: 'Newsletter Recap', value: 'newsletter' },
          { title: 'Article / Update', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      description: 'Leave blank to attribute to The Joseph Center (the org account).',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'excerpt',
      title: 'Short summary for preview cards',
      type: 'text',
    }),
    defineField({
      name: 'category',
      title: 'Post category label',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'publishedAt',
      type: 'date',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'featuredImage',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Full post content (portable text)',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption (optional)' }),
          ],
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'relatedResources',
      title: 'Related Resources',
      description: 'Link to entries from the Resource directory. Shown at the end of the post.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'resource' }] }],
    }),
  ],
  orderings: [
    {
      title: 'Published, newest first',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', media: 'featuredImage', author: 'author.name', type: 'postType' },
    prepare: ({ title, media, author, type }: { title?: string; media?: unknown; author?: string; type?: string }) => ({
      title: title || 'Untitled post',
      subtitle: `${type ?? 'manual'} · ${author ?? 'The Joseph Center'}`,
      media,
    }),
  },
});
