import { defineType, defineField } from 'sanity';
import { IoSettingsSharp } from 'react-icons/io5';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: IoSettingsSharp,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Organization name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Square/circular logo crop (recommended 200×200)',
      type: 'image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'volunteerUrl',
      title: 'Destination for the Volunteer header button',
      type: 'url',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'donateUrl',
      title: 'Destination for the sticky Donate button in the menu',
      type: 'url',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'newsletterHeadline',
      title: 'Newsletter section headline',
      type: 'string',
    }),
    defineField({
      name: 'newsletterSubtext',
      title: 'Supporting text for newsletter signup',
      type: 'string',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright text in footer',
      type: 'string',
    }),
    defineField({
      name: 'craftedBy',
      title: 'Attribution line shown beneath copyright (e.g. "Crafted by Phifer Web Solutions")',
      type: 'string',
    }),
    defineField({
      name: 'businessContact',
      title: 'Name, address, phone — rendered in footer for local SEO. All fields optional.',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
        }),
        defineField({
          name: 'value',
          title: 'Value',
          type: 'string',
        })
      ],
    }),
  ],
});
