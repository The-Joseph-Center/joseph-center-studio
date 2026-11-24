// One-off — renames the footer's donor-portal link.
//
// Why: a monthly donor emailed asking how to stop their gift, having looked at
// the site. The link was there the whole time, labelled "Donor Portal" and
// filed under "Forms" beside Volunteer and Referral — named for the system it
// opens rather than for the thing the donor came to do. The URL does not
// change; only the words someone has to recognise.
//
// Idempotent: it finds the link by its url, not its position, and rewrites the
// label in place. Re-running after a rename in Studio is harmless.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-footer-donor-portal.ts --with-user-token
// Run (production — requires explicit opt-in):
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-footer-donor-portal.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch footerColumns on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-footer-donor-portal.ts --with-user-token'
  )
  process.exit(1)
}

const PORTAL_URL = 'https://josephcentergj.com/portal'
const NEW_LABEL = 'Manage or Stop a Monthly Gift'

type Link = { _key?: string; _type?: string; label?: string; url?: string }
type Column = { _key?: string; _type?: string; title?: string; links?: Link[] }

async function run() {
  console.log(`Renaming the donor-portal footer link on dataset: ${dataset}`)

  const doc = await client.getDocument<{ columns?: Column[] }>('footerColumns')
  if (!doc) {
    console.error('No footerColumns document — the site is on its code fallback. Nothing to patch.')
    process.exit(1)
  }

  let found = 0
  const columns = (doc.columns ?? []).map((col) => ({
    ...col,
    links: (col.links ?? []).map((link) => {
      if (link.url !== PORTAL_URL) return link
      found++
      console.log(`  ${col.title}: "${link.label}" -> "${NEW_LABEL}"`)
      return { ...link, label: NEW_LABEL }
    }),
  }))

  if (!found) {
    console.error(`No footer link points at ${PORTAL_URL}. Nothing changed.`)
    process.exit(1)
  }

  await client.patch('footerColumns').set({ columns }).commit()
  await client.delete('drafts.footerColumns').catch(() => {})
  console.log(`Done — ${found} link renamed. The footer reads from this document, so no rebuild is needed.`)
}

run().catch((err) => {
  console.error('patch-footer-donor-portal failed:', err.message)
  process.exit(1)
})
