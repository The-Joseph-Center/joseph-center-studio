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
    defineField({
      name: 'quote',
      title: 'Favorite quote',
      description: 'Displayed on the board card. Optional.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isAdvisoryBoard',
      title: 'Advisory Board member',
      description: 'Check for advisory board members — displays "Advisory Board Member" label under the name.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
});
