// One-off — patches siteSettings.donationConfig into the staging dataset.
// Idempotent: only sets the donationConfig object (other siteSettings fields
// are untouched). Re-running with new values is safe.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-donation-config.ts --with-user-token
// Run (production — requires explicit opt-in):
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-donation-config.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch donationConfig on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-donation-config.ts --with-user-token'
  )
  process.exit(1)
}

const donationConfig = {
  activePlatform: 'colorado-gives',
  coloradoGivesUrl: 'https://www.coloradogives.org/donate/The-Joseph-Center',
  harnessUrl: 'https://josephcenter.harnessgiving.org/donate',
  campaignName: 'Colorado Gives',
  campaignOverlay: {
    enabled: false,
    campaignName: '',
    campaignUrl: '',
    badgeText: '',
    description: '',
    startsAt: null,
    expiresAt: null,
  },
}

async function run() {
  console.log(`Patching siteSettings.donationConfig on dataset: ${dataset}`)
  await client.patch('siteSettings').set({ donationConfig }).commit()
  await client.delete('drafts.siteSettings').catch(() => {})
  console.log('Done. Initial platform = colorado-gives, announcement bar active until 2026-06-30.')
}

run().catch((err) => {
  console.error('patch-donation-config failed:', err.message)
  process.exit(1)
})
