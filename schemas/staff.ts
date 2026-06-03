import { defineType, defineField } from 'sanity';
import { HiUser } from 'react-icons/hi2';

// Schema mirrors the production dataset's `staff` shape exactly so docs can be
// copied across without transformation. Fields:
//   - name: first name (e.g. "Eva")
//   - title: role label (e.g. "Day Shelter")
//   - email: optional mailto target
//   - image: optional Sanity image
//   - source: optional photo credit (e.g. "Photo by GJ Mahoney Photography")
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
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'image' },
  },
});
