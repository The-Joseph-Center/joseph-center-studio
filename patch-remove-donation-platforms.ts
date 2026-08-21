// One-off — retires the donation platform switcher.
//
// The Colorado Gives campaign ended and Harness was decommissioned, so giving
// now runs entirely through The Joseph Center's own Stripe checkout at /donate.
// siteSettings.donationConfig keeps only `campaignName` and `campaignOverlay`
// (the overlay is how an outside campaign gets featured alongside our own form).
//
// This unsets the three retired fields so Studio stops reporting them as
// unknown fields on the document. Idempotent.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-remove-donation-platforms.ts --with-user-token
// Run (production — requires explicit opt-in):
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-remove-donation-platforms.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to run donation platform cleanup on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-remove-donation-platforms.ts --with-user-token'
  )
  process.exit(1)
}

const RETIRED_FIELDS = [
  'donationConfig.activePlatform',
  'donationConfig.coloradoGivesUrl',
  'donationConfig.harnessUrl',
]

async function run() {
  const docs: { _id: string }[] = await client.fetch(`*[_type == "siteSettings"]{_id}`)
  console.log(`Dataset: ${dataset} — ${docs.length} siteSettings document(s)`)

  for (const doc of docs) {
    await client.patch(doc._id).unset(RETIRED_FIELDS).commit()
    console.log(`  unset ${RETIRED_FIELDS.join(', ')} on ${doc._id}`)
  }

  console.log('\nDone. Every Give button now routes to /donate.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
