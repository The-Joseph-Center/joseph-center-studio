import { defineType, defineField } from 'sanity';
import { HiPlay } from 'react-icons/hi2';

// Schema mirrors the production dataset's `testimonialvideo` shape exactly so
// docs can be copied across without transformation. Note the lowercase _type
// name — Sanity treats _type strings as case-sensitive.
export default defineType({
  name: 'testimonialvideo',
  title: 'Testimonial Video',
  type: 'document',
  icon: HiPlay,
  fields: [
    defineField({
      name: 'title',
      title: 'Name(s) shown on card',
      description: 'Displayed in the gold name banner on the testimonies page.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'YouTube URL',
      description: 'Full URL. The video ID is extracted automatically for the thumbnail.',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'image',
      title: 'Custom thumbnail (optional)',
      description: 'Override the default YouTube thumbnail.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'alt',
      title: 'Image alt text',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Video credit',
      description: 'e.g. "Produced by Lisa Terry"',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'link', media: 'image' },
  },
});
