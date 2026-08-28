import { defineType, defineField } from 'sanity';
import { HiMegaphone } from 'react-icons/hi2';

// Site-wide announcement banner that renders above the header on every page.
// Schema mirrors the production dataset's `banner` shape so docs copy across
// cleanly: title (admin-only label) + message (portable text with links).
//
// Editors typically keep a single banner document. To hide it site-wide,
// either delete the doc or set `active: false`.
export default defineType({
  name: 'banner',
  title: 'Site Banner',
  type: 'document',
  icon: HiMegaphone,
  fields: [
    defineField({
      name: 'title',
      title: 'Admin label',
      description: 'Internal name for this banner (not displayed). e.g. "Colorado Gives (Active)".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Banner message',
      description: 'Shown across the top of every page. Supports inline links.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [{ name: 'href', title: 'URL', type: 'url' }],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Show this banner',
      description: 'Uncheck to hide without deleting.',
      type: 'boolean',
      initialValue: true,
    }),
    // Closure notices are the common case and they are always time-boxed.
    // "Closed today because of snow" left up all week is worse than no banner,
    // and relies on somebody remembering to come back and untick a box.
    defineField({
      name: 'startsAt',
      title: 'Starts showing (optional)',
      description: 'Leave blank to show as soon as it is switched on.',
      type: 'datetime',
    }),
    defineField({
      name: 'endsAt',
      title: 'Stops showing (optional)',
      description:
        'Leave blank to show until it is switched off. Set this for anything temporary — a closure notice that outlives the closure does more harm than no notice at all.',
      type: 'datetime',
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active' },
    prepare: ({ title, active }: { title?: string; active?: boolean }) => ({
      title: title || 'Site Banner',
      subtitle: active === false ? 'Hidden' : 'Showing',
    }),
  },
});
