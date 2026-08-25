import { defineType, defineField } from 'sanity';
import { HiClipboardDocumentList } from 'react-icons/hi2';

// TEMPORARY — internal staff intake tool rendered on /staff.
//
// Shows every uploaded photo that isn't attached to a staff member, with fields
// for a manager to identify them, plus the existing staff with their title and
// department pre-filled for correction. Submissions are emailed, not written
// back to Sanity, so the details are still entered here by hand after review.
//
// To take the tool off the site: remove this section from the /staff page. No
// deploy is needed. Once the answers are in, the schema, the frontend component
// (StaffIntakeSection.vue), the function (submit-staff-intake.ts) and its email
// template can all be deleted.
export default defineType({
  name: 'staffIntakeSection',
  title: 'Staff Intake (temporary)',
  type: 'object',
  icon: HiClipboardDocumentList,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Help us fill in the staff page',
    }),
    defineField({
      name: 'intro',
      title: 'Intro text',
      description: 'Shown above the form. Explain that nothing here changes the live site.',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }: { heading?: string }) => ({
      title: heading || 'Staff Intake',
      subtitle: 'TEMPORARY — internal form, remove once submissions are in',
    }),
  },
});
