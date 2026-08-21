import { defineType, defineField } from 'sanity';

// One-time gift section on /donate. Behavior is controlled by the
// the campaign overlay in siteSettings.donationConfig on the frontend, not by
// the CMS — this schema only carries the banner heading.
export default defineType({
  name: 'oneTimeGiftSection',
  title: 'One-Time Gift Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Banner heading',
      type: 'string',
      initialValue: 'One-Time Gift',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading / call to action',
      type: 'string',
      initialValue: 'Make a secure one-time donation to The Joseph Center.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }: { title?: string }) => ({
      title: title || 'One-Time Gift',
    }),
  },
});
