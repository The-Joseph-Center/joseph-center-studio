import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonialVideo',
  title: 'Testimonial Video',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'youtubeId',
      title: 'youtubeId',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'thumbnailUrl',
      title: 'thumbnailUrl',
      type: 'url',
    }),
  ],
});
