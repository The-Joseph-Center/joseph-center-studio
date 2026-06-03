import { defineType, defineField } from 'sanity';
import { HiUserCircle } from 'react-icons/hi2';

// Schema mirrors the production dataset's `board` shape exactly so docs can be
// copied across without transformation. Production docs only carry name +
// image — extra fields like title/email are intentionally absent.
export default defineType({
  name: 'board',
  title: 'Board Member',
  type: 'document',
  icon: HiUserCircle,
  fields: [
    defineField({
      name: 'name',
      title: 'First name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
});
