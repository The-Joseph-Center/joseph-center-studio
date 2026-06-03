// One-off script — patches the `siteSettings` document with the
// businessContact + hours fields added in 07-footer wiring. The regular seed
// uses createIfNotExists and won't touch existing docs.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-site-settings.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch siteSettings on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-site-settings.ts --with-user-token'
  )
  process.exit(1)
}

async function run() {
  console.log(`Patching siteSettings on dataset: ${dataset}`)
  await client
    .patch('siteSettings')
    .set({
      businessContact: {
        phone: '(970) 243-7672',
        addressLine1: '2511 Belford Ave #9',
        addressLine2: 'Grand Junction, CO 81501',
      },
      hours: {
        office: { days: 'Monday – Friday', time: '8:00am – 5:00pm' },
        dayShelter: { days: 'Mon – Sat', time: '8:00am – 3:00pm' },
      },
    })
    .commit()
  console.log('siteSettings patched. Hard-refresh the frontend to see new footer data.')
}

run().catch((err) => {
  console.error('patch-site-settings failed:', err.message)
  process.exit(1)
})
