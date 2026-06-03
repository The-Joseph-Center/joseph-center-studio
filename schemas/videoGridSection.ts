import { defineType, defineField } from 'sanity';

// Section that fetches all testimonialvideo documents and renders them as a
// 2-column video grid (used on the /testimonies "Our Guests" page).
export default defineType({
  name: 'videoGridSection',
  title: 'Video Grid Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section heading (optional)',
      description: 'Leave blank to show the grid without a heading.',
      type: 'string',
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }: { heading?: string }) => ({
      title: heading || 'Video Grid — Testimonials',
    }),
  },
});
