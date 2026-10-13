import { defineType, defineField } from 'sanity';
import { HiCalendarDays } from 'react-icons/hi2';

// Schema mirrors the production dataset's `events` shape (plural, lowercase
// _type) so docs can be copied across without transformation. The additive
// fields ctaLabel, ctaHref, and featured come from 14-events-pages.md; they
// don't exist on production docs yet and default sensibly when absent.
//
// The nested `Logos` object type for sponsors matches production exactly,
// including the capital-L _type string.
export default defineType({
  name: 'events',
  title: 'Event',
  type: 'document',
  icon: HiCalendarDays,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      description: 'The day the event happens. The website shows the day only — if there is a start time, put it in the description where it can be explained.',
      type: 'datetime',
    }),
    defineField({
      name: 'image',
      title: 'Event image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'alt',
      title: 'Image alt text',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Rich text. Rendered on the events list (truncated) and event detail (full).',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      description: 'Rich text. Shown on the event detail page.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'invitation',
      title: 'Invitation / supporting copy',
      description: 'Rich text. Optional extra block shown on the detail page.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'sponsors',
      title: 'Sponsors',
      description: 'Logos shown at the bottom of the event detail page.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'Logos',
          title: 'Sponsor',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({ name: 'website', title: 'Website', type: 'url' }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        },
      ],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA button label',
      description: 'e.g. "Register Today", "Sign Up to Win", "Learn More". Leave blank to hide the CTA.',
      type: 'string',
      initialValue: 'Register Today',
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA button link',
      description: 'External registration URL or internal route.',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Featured event',
      description: 'Pin to top of the events list regardless of date.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Featured, then date ascending',
      name: 'listOrder',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'date', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'title', date: 'date', featured: 'featured', media: 'image' },
    // The raw field is an ISO timestamp — "2026-12-25T22:39:00.000Z" — which is
    // unreadable in a list of events and carries a time nobody chose.
    prepare: ({ title, date, featured, media }: { title?: string; date?: string; featured?: boolean; media?: unknown }) => {
      const d = date ? new Date(date) : null;
      const when = d && !Number.isNaN(d.getTime())
        ? d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
        : 'No date set';
      const past = d && !Number.isNaN(d.getTime()) && d.getTime() < Date.now();
      return {
        title: title || 'Event',
        subtitle: [when, past ? 'past' : null, featured ? 'featured' : null].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
