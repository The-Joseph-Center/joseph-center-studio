import { defineType, defineField } from 'sanity';
import { HiUser } from 'react-icons/hi2';

// Schema mirrors the production dataset's `staff` shape exactly so docs can be
// copied across without transformation. Fields:
//   - name: first name (e.g. "Eva")
//   - title: role label (e.g. "Day Shelter")
//   - email: optional mailto target
//   - image: optional Sanity image
//   - source: optional photo credit (e.g. "Photo by GJ Mahoney Photography")
//   - departments: which teams this person serves (drives the staff section on
//     program pages — see frontend/src/lib/departments.ts for the mapping)
export default defineType({
  name: 'staff',
  title: 'Staff Member',
  type: 'document',
  icon: HiUser,
  fields: [
    defineField({
      name: 'name',
      title: 'First name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Role / title',
      type: 'string',
    }),
    defineField({
      name: 'hidden',
      title: 'Hide from website',
      description:
        'Temporarily removes this person from the public site — the staff page, and any program page team section — without deleting the document. Use when someone leaves; their photo, title and history stay intact so they can be restored with one click.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'departments',
      title: 'Department(s)',
      description:
        'Which team(s) this person serves. Staff appear in the "Meet the Team" section at the bottom of the matching program page. Use "Unknown / Needs Review" for anyone whose name, title or department still needs confirming — they show on the main Staff page only until someone reassigns them. Keep this list in sync with frontend/src/lib/departments.ts.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Day Shelter', value: 'day-shelter' },
          { title: 'Family Center', value: 'family-center' },
          { title: 'Golden Girls Project', value: 'golden-girls' },
          { title: 'Integrated Financial Services', value: 'ifs' },
          { title: 'IT & Marketing', value: 'it-marketing' },
          { title: 'Kitchen & Food Services', value: 'kitchen' },
          { title: 'Maintenance', value: 'maintenance' },
          { title: 'Security', value: 'security' },
          { title: 'Operations', value: 'operations' },
          { title: 'Unknown / Needs Review', value: 'unknown' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'email',
      title: 'Email address',
      description: 'Used for the "Contact [name] →" link. Leave blank to hide the link.',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'source',
      title: 'Photo credit',
      description: 'Shown as small caption credit when set, e.g. "Photo by GJ Mahoney Photography".',
      type: 'string',
    }),
    defineField({
      name: 'quote',
      title: 'Favorite quote',
      description: 'Displayed on the staff card in place of the contact link. Optional.',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'image', hidden: 'hidden' },
    prepare({ title, subtitle, media, hidden }: { title?: string; subtitle?: string; media?: any; hidden?: boolean }) {
      return {
        title: hidden ? `${title ?? 'Untitled'} — hidden` : (title ?? 'Untitled'),
        subtitle,
        media,
      };
    },
  },
});
