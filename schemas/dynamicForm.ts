import { defineType, defineField } from 'sanity';
import { HiClipboardDocumentList } from 'react-icons/hi2';

// CMS-driven form document. Field shape mirrors what
// netlify/functions/submit-dynamic-form.ts and get-form.ts already query:
//   title, slug, active, activeDates{start,end}, description, fields[],
//   successMessage, notifyEmail.
//
// Used for seasonal forms (Easter Basket, Angel Tree) and any future
// editor-managed form that doesn't need bespoke server logic.
export default defineType({
  name: 'dynamicForm',
  title: 'Dynamic Form',
  type: 'document',
  icon: HiClipboardDocumentList,
  fields: [
    defineField({
      name: 'title',
      title: 'Form title',
      description: 'Shown in the green banner on the form page (e.g. "Easter Basket Order").',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Used to reference this form in the URL/route props. e.g. "easter-basket-order".',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Form is open',
      description: 'Uncheck to close the form and show an "unavailable" message instead.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'activeDates',
      title: 'Active date range (optional)',
      description: 'When set, the form is only open between these dates AND the "Form is open" toggle must be checked.',
      type: 'object',
      fields: [
        defineField({ name: 'start', title: 'Opens at', type: 'datetime' }),
        defineField({ name: 'end', title: 'Closes at', type: 'datetime' }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Shown above the form fields. Plain text only.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'fields',
      title: 'Form fields',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'formField',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Field name (key)',
              description: 'Used as the JSON key when the submission is stored. Use camelCase, no spaces. e.g. "firstName".',
              type: 'string',
              validation: (Rule) => Rule.required().regex(/^[a-zA-Z][a-zA-Z0-9]*$/, { name: 'camelCase identifier' }),
            }),
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Text (single line)', value: 'text' },
                  { title: 'Email', value: 'email' },
                  { title: 'Phone', value: 'phone' },
                  { title: 'Number', value: 'number' },
                  { title: 'Textarea (multi-line)', value: 'textarea' },
                  { title: 'Select (dropdown)', value: 'select' },
                ],
                layout: 'dropdown',
              },
              initialValue: 'text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'required',
              title: 'Required',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'options',
              title: 'Options',
              description: 'For Select fields only. One option per line.',
              type: 'array',
              of: [{ type: 'string' }],
              hidden: ({ parent }: any) => parent?.type !== 'select',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'type', required: 'required' },
            prepare: ({ title, subtitle, required }: { title?: string; subtitle?: string; required?: boolean }) => ({
              title: title || 'Field',
              subtitle: `${subtitle ?? 'text'}${required ? ' · required' : ''}`,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      description: 'Shown after the form is successfully submitted.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'notifyEmail',
      title: 'Notification email',
      description: 'Staff member who receives an email notification each time the form is submitted. Leave blank to skip notifications.',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active' },
    prepare: ({ title, active }: { title?: string; active?: boolean }) => ({
      title: title || 'Dynamic Form',
      subtitle: active ? 'Open' : 'Closed',
    }),
  },
});
