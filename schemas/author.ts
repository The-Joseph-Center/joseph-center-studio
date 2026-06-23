import { defineType, defineField } from 'sanity';
import { HiUserCircle } from 'react-icons/hi2';

// Author of a blog post. Two kinds:
//   - Individuals (Mona, Eric, etc.) — name, avatar, optional bio.
//   - The Joseph Center "org account" — set isOrg=true. The frontend hides
//     individual byline styling ("by ...") for org posts so they read as
//     coming from JC at large.
export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: HiUserCircle,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar / Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Bio (optional)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'isOrg',
      title: 'Organization account',
      description: 'Check for the "The Joseph Center" org author — frontend hides the "by …" byline for org posts.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', media: 'avatar', isOrg: 'isOrg' },
    prepare: ({ title, media, isOrg }: { title?: string; media?: unknown; isOrg?: boolean }) => ({
      title: title || 'Unnamed author',
      subtitle: isOrg ? 'Organization account' : 'Individual',
      media,
    }),
  },
});
