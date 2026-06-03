// One-off script — finds stale drafts in staging for doc types we've been
// patching with createOrReplace (page, legalPage, siteSettings, events, etc.)
// and deletes them.
//
// Why this is needed: our patch scripts wrote to published documents directly,
// but Studio's editor view shows the draft when one exists. Drafts left over
// from the original agency-template scaffold continue to override what
// editors see, even though the live frontend (using the published version
// via CDN) renders correctly.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec cleanup-stale-drafts.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to delete drafts on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec cleanup-stale-drafts.ts --with-user-token'
  )
  process.exit(1)
}

// Doc types we've patched and where stale drafts cause editor confusion.
const TYPES_TO_CLEAN = [
  'page',
  'legalPage',
  'siteSettings',
  'footerColumns',
  'events',
  'program',
  'staff',
  'board',
  'testimonialvideo',
  'banner',
] as const

async function run() {
  console.log(`Scanning for stale drafts on dataset: ${dataset}`)

  const drafts = await client.fetch<Array<{ _id: string; _type: string; title?: string }>>(
    `*[_id in path("drafts.**") && _type in $types]{_id, _type, title}`,
    { types: [...TYPES_TO_CLEAN] }
  )

  if (!drafts.length) {
    console.log('No stale drafts found. Nothing to do.')
    return
  }

  console.log(`Found ${drafts.length} draft(s):`)
  for (const d of drafts) {
    console.log(`  ${d._id} (${d._type}) — ${d.title ?? '—'}`)
  }

  const tx = client.transaction()
  for (const d of drafts) tx.delete(d._id)
  await tx.commit()

  console.log(`\nDeleted ${drafts.length} draft(s). Reload Studio to see the published versions.`)
}

run().catch((err) => {
  console.error('cleanup-stale-drafts failed:', err.message)
  process.exit(1)
})
