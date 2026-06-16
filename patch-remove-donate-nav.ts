// One-off — removes the "Donate" nav item from nav-main (and any other nav
// doc that has one) now that the donate button has been replaced by a
// floating action button + modal on every page.
//
// Idempotent: if no Donate item exists, the script is a no-op.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-remove-donate-nav.ts --with-user-token
// Run (production):
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-remove-donate-nav.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch nav on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-remove-donate-nav.ts --with-user-token'
  )
  process.exit(1)
}

type NavItem = { _key: string; label?: string; url?: string }
type NavDoc = { _id: string; _rev?: string; navType?: string; items?: NavItem[] }

function looksLikeDonate(item: NavItem): boolean {
  const label = (item.label || '').trim().toLowerCase()
  const url = (item.url || '').trim().toLowerCase()
  return label === 'donate' || label === 'give' || url === '/donate'
}

async function run() {
  console.log(`Removing Donate links from navigation docs on dataset: ${dataset}`)

  const navDocs = await client.fetch<NavDoc[]>(`*[_type == "navigation"]`)
  for (const doc of navDocs) {
    if (!doc.items?.length) continue
    const filtered = doc.items.filter((item) => !looksLikeDonate(item))
    if (filtered.length === doc.items.length) {
      console.log(`  ${doc._id} (${doc.navType}): no Donate item — skip`)
      continue
    }
    await client.createOrReplace({ ...doc, items: filtered })
    await client.delete(`drafts.${doc._id}`).catch(() => {})
    console.log(`  ${doc._id} (${doc.navType}): removed ${doc.items.length - filtered.length} item(s)`)
  }

  console.log('Done.')
}

run().catch((err) => {
  console.error('patch-remove-donate-nav failed:', err.message)
  process.exit(1)
})
