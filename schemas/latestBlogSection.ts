import { defineType, defineField } from 'sanity';

// "Latest from the Blog" teaser — surfaces the N most recent posts on the
// home page (or any page) and links out to /blog. Mirrors the shape of
// latestCoffeeChatSection so editors get a familiar form.
export default defineType({
  name: 'latestBlogSection',
  title: 'Latest Blog Posts Teaser',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Latest from the Blog',
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'postCount',
      title: 'How many posts to show',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(6).integer(),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA button label',
      type: 'string',
      initialValue: 'Read All Posts →',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }: { title?: string }) => ({
      title: title || 'Latest Blog Posts Teaser',
    }),
  },
});
