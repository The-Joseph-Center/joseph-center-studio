// One-off script — sets the footer CTA band copy on the siteSettings doc
// per 20-fix-cta-band.md. Touches only the CTA band fields; everything else
// (logo, hours, businessContact, etc.) is left intact.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-cta-band.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch siteSettings on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-cta-band.ts --with-user-token'
  )
  process.exit(1)
}

async function run() {
  console.log(`Patching footer CTA band on dataset: ${dataset}`)
  await client
    .patch('siteSettings')
    .set({
      ctaHeadline: "We're Community Funded",
      ctaSubtext:
        'Your generosity restores dignity and changes lives in Grand Junction, Colorado.',
      ctaFooterLabel: 'Support Our Mission',
      ctaFooterUrl: '/donate',
    })
    .commit()
  console.log('CTA band updated. Hard-refresh any page to see it.')
}

run().catch((err) => {
  console.error('patch-cta-band failed:', err.message)
  process.exit(1)
})
