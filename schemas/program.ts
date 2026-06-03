import { defineType, defineField } from 'sanity';
import { HiUserGroup } from 'react-icons/hi2';

export default defineType({
  name: 'program',
  title: 'Programs',
  type: 'document',
  icon: HiUserGroup,
  fields: [
    defineField({
      name: 'title',
      title: 'Program Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      description: 'The slug after /programs/ (e.g. "day-shelter")',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      description: 'Used for SEO. ~150 characters.',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'visionHeading',
      title: 'Vision heading',
      type: 'string',
      initialValue: 'Our Vision',
    }),
    defineField({
      name: 'visionBody',
      title: 'Vision body',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'howWeHelpContent',
      title: 'How We Help (rich text)',
      description: 'Headings, paragraphs, and lists describing what the program does.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'inlineCtas',
      title: 'Inline CTAs',
      description: 'Buttons rendered below the How We Help content.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'inlineCta',
        fields: [
          defineField({ name: 'label', title: 'Button label', type: 'string' }),
          defineField({ name: 'href', title: 'URL or path', type: 'string' }),
          defineField({
            name: 'variant',
            title: 'Style',
            type: 'string',
            options: {
              list: [
                { title: 'Primary (green fill)', value: 'primary' },
                { title: 'Secondary (gold fill)', value: 'secondary' },
                { title: 'Ghost (outlined)', value: 'ghost' },
              ],
              layout: 'radio',
            },
            initialValue: 'primary',
          }),
        ],
        preview: {
          select: { title: 'label', subtitle: 'variant' },
        },
      }],
    }),
    defineField({
      name: 'donorAppealEnabled',
      title: 'Show "How You Can Help" donor appeal',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'personDescriptor',
      title: 'Person descriptor (donor appeal)',
      description: 'Used in "You can help X for as little as $25/month." e.g. "a Golden Girl", "a family", "a guest".',
      type: 'string',
      initialValue: 'someone in need',
      hidden: ({ parent }: any) => parent?.donorAppealEnabled === false,
    }),
    defineField({
      name: 'donationsPageEnabled',
      title: 'Donations page enabled',
      description: 'Uncheck to hide /programs/[slug]/donations. The page redirects to the program page instead.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'donationsSection',
      title: 'Donations section (banner + two cards)',
      type: 'object',
      hidden: ({ parent }: any) => parent?.donationsPageEnabled === false,
      fields: [
        defineField({
          name: 'programName',
          title: 'Banner program name',
          description: 'Used in the banner heading, e.g. "Day Shelter & Food Pantry"',
          type: 'string',
        }),
        defineField({
          name: 'sponsorCard',
          title: 'Sponsor an Event card',
          type: 'object',
          fields: [
            defineField({ name: 'enabled', title: 'Show this card', type: 'boolean', initialValue: true }),
            defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Sponsor an Event' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'buttonLabel', title: 'Button label', type: 'string', initialValue: 'Contact Us' }),
            defineField({ name: 'buttonHref', title: 'Button link', type: 'string', initialValue: '/contact' }),
          ],
        }),
        defineField({
          name: 'donateCard',
          title: 'Donate Supplies card',
          type: 'object',
          fields: [
            defineField({ name: 'enabled', title: 'Show this card', type: 'boolean', initialValue: true }),
            defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Donate Supplies' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'buttonLabel', title: 'Button label', type: 'string', initialValue: 'Give' }),
            defineField({ name: 'buttonHref', title: 'Button link', type: 'string', initialValue: '/donate' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'resourcesSection',
      title: 'Education & resources section (banner + two cards)',
      type: 'object',
      hidden: ({ parent }: any) => parent?.donationsPageEnabled === false,
      fields: [
        defineField({
          name: 'programName',
          title: 'Banner program name',
          type: 'string',
        }),
        defineField({
          name: 'learnCard',
          title: 'Learn card',
          type: 'object',
          fields: [
            defineField({ name: 'enabled', title: 'Show this card', type: 'boolean', initialValue: true }),
            defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Learn' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'buttonLabel', title: 'Button label', type: 'string', initialValue: 'Learn More' }),
            defineField({ name: 'buttonHref', title: 'Button link', type: 'string', initialValue: '/our-story' }),
          ],
        }),
        defineField({
          name: 'resourcesCard',
          title: 'Free Resources card',
          type: 'object',
          fields: [
            defineField({ name: 'enabled', title: 'Show this card', type: 'boolean', initialValue: true }),
            defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Free Resources' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'buttonLabel', title: 'Button label', type: 'string', initialValue: 'Learn More' }),
            defineField({ name: 'buttonHref', title: 'Button link', type: 'string', initialValue: '/our-story' }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', media: 'heroImage' },
    prepare({ title, slug, media }) {
      return {
        title: title || 'Untitled program',
        subtitle: slug ? `/programs/${slug}` : '—',
        media,
      };
    },
  },
});
