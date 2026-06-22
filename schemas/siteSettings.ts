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
      title: 'Logo (light mode)',
      description: 'Default logo. Square/circular crop, recommended 400×400. Use the hotspot tool to set the focal point.',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'darkLogo',
      title: 'Logo (dark mode)',
      description: 'Optional. Shown in place of the light-mode logo when the site is in dark mode.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'volunteerUrl',
      title: 'Destination for the Volunteer header button',
      description: 'Internal path (e.g. /forms/volunteer) or external URL (https://…)',
      type: 'url',
      validation: Rule => Rule.required().uri({
        scheme: ['http', 'https', 'mailto', 'tel'],
        allowRelative: true,
      }),
    }),
    defineField({
      name: 'donate',
      title: 'Donate button',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show donate button',
          description: 'Off until the donation flow is ready',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'mode',
          title: 'How clicking it should behave',
          type: 'string',
          options: {
            list: [
              { title: 'External link / platform', value: 'external' },
              { title: 'Internal donation flow', value: 'internal' },
            ],
            layout: 'radio',
          },
          initialValue: 'external',
        }),
        defineField({
          name: 'externalUrl',
          title: 'External destination URL',
          description: 'Used when mode is "External". Direct link or platform URL backed by an API integration.',
          type: 'url',
          hidden: ({ parent }) => parent?.mode !== 'external',
          validation: Rule => Rule.uri({ scheme: ['http', 'https'] }),
        }),
      ],
    }),
    defineField({
      name: 'donationConfig',
      title: 'Donation Platform Configuration',
      description:
        'Controls which giving platform is active sitewide. Switch activePlatform to flip all Give/Donate buttons at once — no developer involvement needed. See seed.ts for the operational checklist on cutover dates.',
      type: 'object',
      fields: [
        defineField({
          name: 'activePlatform',
          title: 'Active Giving Platform',
          type: 'string',
          options: {
            list: [
              { title: 'Colorado Gives (external redirect)', value: 'colorado-gives' },
              { title: 'Harness (in-site modal)', value: 'harness' },
              { title: 'Stripe (internal checkout)', value: 'stripe' },
            ],
            layout: 'radio',
          },
          initialValue: 'colorado-gives',
          validation: (Rule) => Rule.required(),
          description: 'Colorado Gives → June 30 2026. Harness → July 1 – Dec 31 2026. Stripe → Jan 1 2027 onward.',
        }),
        defineField({
          name: 'coloradoGivesUrl',
          title: 'Colorado Gives Donate URL',
          type: 'url',
          initialValue: 'https://www.coloradogives.org/donate/The-Joseph-Center',
        }),
        defineField({
          name: 'harnessUrl',
          title: 'Harness Donate URL (fallback)',
          description: 'Direct link used as a fallback if the Harness modal widget fails to load.',
          type: 'url',
          initialValue: 'https://josephcenter.harnessgiving.org/donate',
        }),
        defineField({
          name: 'campaignName',
          title: 'Current Campaign Name',
          description: 'e.g. "Colorado Gives" — shown in announcement bar and button tooltips.',
          type: 'string',
          initialValue: 'Colorado Gives',
        }),
        defineField({
          name: 'campaignOverlay',
          title: 'Campaign Overlay (optional)',
          description:
            'When active and within the date window, shows a featured campaign option alongside Stripe on the donate page. Use for Colorado Gives Day, Giving Tuesday, matching campaigns, etc. Auto-hides on expiresAt. Only shown for one-time gifts; recurring always goes through Stripe.',
          type: 'object',
          fields: [
            defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: false }),
            defineField({
              name: 'campaignName',
              title: 'Campaign Name',
              description: 'e.g. "Colorado Gives Day 2027"',
              type: 'string',
            }),
            defineField({ name: 'campaignUrl', title: 'Campaign URL', type: 'url' }),
            defineField({
              name: 'badgeText',
              title: 'Badge Text',
              description: 'Short match/incentive text shown on the card. e.g. "Gifts matched up to $50,000"',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              description: 'One sentence explaining the campaign.',
              type: 'text',
              rows: 2,
            }),
            defineField({ name: 'startsAt', title: 'Campaign Starts', type: 'datetime' }),
            defineField({ name: 'expiresAt', title: 'Campaign Ends', type: 'datetime' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'ctaHeadline',
      title: 'Footer CTA band — heading',
      description: 'Headline shown in the dark CTA strip above the footer.',
      type: 'string',
    }),
    defineField({
      name: 'ctaSubtext',
      title: 'Footer CTA band — subtext',
      description: 'Supporting text shown beneath the heading.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaFooterLabel',
      title: 'Footer CTA band — button label',
      description: 'Falls back to ctaLabel if blank.',
      type: 'string',
    }),
    defineField({
      name: 'ctaFooterUrl',
      title: 'Footer CTA band — button link',
      description: 'Internal path (/donate) or external URL. Falls back to ctaUrl if blank.',
      type: 'string',
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
      title: 'Phone & address — rendered in footer for local SEO. All fields optional.',
      type: 'object',
      fields: [
        defineField({
          name: 'phone',
          title: 'Phone number (display format, e.g. "(970) 243-7672")',
          type: 'string',
        }),
        defineField({
          name: 'addressLine1',
          title: 'Address line 1',
          type: 'string',
        }),
        defineField({
          name: 'addressLine2',
          title: 'Address line 2 (city, state ZIP)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Office & day-shelter hours — rendered in the footer',
      type: 'object',
      fields: [
        defineField({
          name: 'office',
          title: 'Office hours',
          type: 'object',
          fields: [
            defineField({ name: 'days', title: 'Days (e.g. "Monday – Friday")', type: 'string' }),
            defineField({ name: 'time', title: 'Time (e.g. "8:00am – 5:00pm")', type: 'string' }),
          ],
        }),
        defineField({
          name: 'dayShelter',
          title: 'Day shelter hours',
          type: 'object',
          fields: [
            defineField({ name: 'days', title: 'Days (e.g. "Mon – Sat")', type: 'string' }),
            defineField({ name: 'time', title: 'Time (e.g. "8:00am – 3:00pm")', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
});
