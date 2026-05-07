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
    }),
    defineField({
      name: 'body',
      title: 'Full post content (portable text)',
      type: 'array',
      of: [{ type: 'block' }],
      validation: Rule => Rule.required(),
    }),
  ],
});
