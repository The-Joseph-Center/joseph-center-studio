// One-off script — seeds the Easter Basket and Christmas Angel Tree dynamic
// forms (22-seasonal-special-forms.md). Both land with active: false so the
// forms render as "not currently available" until staff opens them in Studio.
//
// Deletes any pre-existing drafts before writing to prevent the
// "Studio shows stale draft" issue we hit on page-our-story.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-seasonal-forms.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to seed forms on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-seasonal-forms.ts --with-user-token'
  )
  process.exit(1)
}

const easterBasket = {
  _type: 'dynamicForm',
  _id: 'form-easter-basket',
  title: 'Easter Basket Order',
  slug: { _type: 'slug', current: 'easter-basket-order' },
  active: false,
  description:
    'Place your Easter basket order for The Joseph Center community. All orders support families in the Grand Valley.',
  fields: [
    { _key: 'eb-1', label: 'First Name', name: 'firstName', type: 'text', required: true },
    { _key: 'eb-2', label: 'Last Name', name: 'lastName', type: 'text', required: true },
    { _key: 'eb-3', label: 'Phone Number', name: 'phone', type: 'phone', required: true },
    { _key: 'eb-4', label: 'Email Address', name: 'email', type: 'email', required: true },
    { _key: 'eb-5', label: 'Number of Baskets', name: 'quantity', type: 'number', required: true },
    { _key: 'eb-6', label: 'Special Requests or Notes', name: 'notes', type: 'textarea', required: false },
  ],
  successMessage:
    "Thank you for your Easter basket order! We'll be in touch with pickup details.",
  notifyEmail: '',
}

const angelTree = {
  _type: 'dynamicForm',
  _id: 'form-angel-tree',
  title: 'Christmas Angel Tree',
  slug: { _type: 'slug', current: 'angel-tree' },
  active: false,
  description:
    "Sign up to give or receive gifts through The Joseph Center's Christmas Angel Tree program.",
  fields: [
    { _key: 'at-1', label: 'First Name', name: 'firstName', type: 'text', required: true },
    { _key: 'at-2', label: 'Last Name', name: 'lastName', type: 'text', required: true },
    { _key: 'at-3', label: 'Phone Number', name: 'phone', type: 'phone', required: true },
    { _key: 'at-4', label: 'Email Address', name: 'email', type: 'email', required: true },
    {
      _key: 'at-5',
      label: 'I would like to',
      name: 'participation',
      type: 'select',
      required: true,
      options: ['Donate gifts', 'Receive gifts', 'Both'],
    },
    { _key: 'at-6', label: 'Number in household (if receiving)', name: 'householdSize', type: 'number', required: false },
    { _key: 'at-7', label: 'Notes or special requests', name: 'notes', type: 'textarea', required: false },
  ],
  successMessage:
    "Thank you for signing up for the Angel Tree program! We'll follow up with more details.",
  notifyEmail: '',
}

async function run() {
  console.log(`Seeding seasonal dynamic forms on dataset: ${dataset}`)
  const tx = client.transaction()
  // Drop any shadow drafts so Studio shows the published canonical version.
  tx.delete('drafts.form-easter-basket')
  tx.delete('drafts.form-angel-tree')
  tx.createOrReplace(easterBasket)
  tx.createOrReplace(angelTree)
  await tx.commit()
  console.log('Done. Easter Basket + Angel Tree forms seeded as inactive.')
}

run().catch((err) => {
  console.error('patch-seasonal-forms failed:', err.message)
  process.exit(1)
})
