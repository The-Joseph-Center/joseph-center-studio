// Removes the `[TEST]` placeholder documents that were seeded during layout
// work — 3 fake events and 5 fake annual reports / Form 990s, all with ids
// matching `*fake*`.
//
// This MUST run before launch. The fake annualReport docs render on the public
// /transparency page as "2023 Form 990", "2024 Annual Report" and similar, with
// no PDF attached — publishing those on a nonprofit's transparency page
// misrepresents its filings. With them gone the page shows its empty state
// ("Annual reports and Form 990s will be available here soon.") until real PDFs
// are uploaded.
//
// Replaces patch-fake-events.ts and patch-fake-transparency-reports.ts, which
// created these documents and were deleted once real content existed.
//
// Dry run by default — prints what it would delete and changes nothing.
// Add APPLY=yes to actually delete.
//
// Dry run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-remove-fake-content.ts --with-user-token
// Apply (staging):
//   APPLY=yes SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-remove-fake-content.ts --with-user-token
// Apply (production — requires explicit opt-in):
//   APPLY=yes CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-remove-fake-content.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset
const apply = process.env.APPLY === 'yes'

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to remove content on production.\n' +
      'Re-run with:\n' +
      '  APPLY=yes CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-remove-fake-content.ts --with-user-token'
  )
  process.exit(1)
}

type Doc = { _id: string; _type: string; title?: string; year?: number }

async function run() {
  const docs: Doc[] = await client.fetch(
    `*[_id match "*fake*"]{_id, _type, title, year} | order(_type asc, _id asc)`
  )

  console.log(`Dataset: ${dataset} — ${apply ? 'APPLY' : 'DRY RUN'}\n`)

  if (!docs.length) {
    console.log('No placeholder documents found. Nothing to do.')
    return
  }

  for (const d of docs) {
    console.log(`  ${apply ? 'delete' : '  would delete'}  ${d._type.padEnd(14)} ${d._id.padEnd(30)} ${d.title ?? d.year ?? ''}`)
  }

  if (!apply) {
    console.log(`\n${docs.length} document(s) would be deleted. Re-run with APPLY=yes to proceed.`)
    return
  }

  // Delete drafts alongside published docs so nothing reappears in Studio.
  await client
    .transaction(
      docs.flatMap((d) => [
        { delete: { id: d._id } },
        { delete: { id: `drafts.${d._id}` } },
      ]) as never
    )
    .commit()
    .catch(async () => {
      // Fall back to one-by-one if a draft id doesn't exist.
      for (const d of docs) {
        await client.delete(d._id).catch(() => {})
        await client.delete(`drafts.${d._id}`).catch(() => {})
      }
    })

  console.log(`\nDeleted ${docs.length} placeholder document(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
