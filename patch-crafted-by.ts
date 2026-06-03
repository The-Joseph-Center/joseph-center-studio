// One-off — sets the siteSettings.craftedBy attribution line. Touches only
// that field; everything else on the doc is left intact.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-crafted-by.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch siteSettings on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-crafted-by.ts --with-user-token'
  )
  process.exit(1)
}

async function run() {
  console.log(`Setting siteSettings.craftedBy on dataset: ${dataset}`)
  await client
    .patch('siteSettings')
    .set({ craftedBy: 'Crafted by Phifer Web Solutions' })
    .commit()
  await client.delete('drafts.siteSettings').catch(() => {})
  console.log('Done.')
}

run().catch((err) => {
  console.error('patch-crafted-by failed:', err.message)
  process.exit(1)
})
