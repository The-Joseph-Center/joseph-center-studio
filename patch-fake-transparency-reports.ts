// One-off — creates placeholder `annualReport` docs in staging so the
// /transparency page renders with realistic content for layout testing.
//
// Docs are created WITHOUT a real PDF file attached (the schema's required
// `file` validation only fires in Studio, not on direct API writes). The
// frontend's <a :href="fileUrl || '#'"> gracefully falls back to '#' when
// fileUrl is null. Visually identical for layout testing.
//
// Identifiers prefixed `report-fake-*` and titles prefixed `[TEST]` so
// they're easy to find/delete afterward.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-fake-transparency-reports.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to seed fake annual reports on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-fake-transparency-reports.ts --with-user-token'
  )
  process.exit(1)
}

// Mix of 990s, annual reports, and audited financials across four years so
// the list shows the full visual rhythm — multiple per year, year gaps,
// some with descriptions and some without.
const fakeReports = [
  {
    _type: 'annualReport',
    _id: 'report-fake-2024-990',
    year: 2024,
    title: '[TEST] 2024 Form 990',
    description: 'IRS Form 990 — annual return for tax-exempt organizations.',
  },
  {
    _type: 'annualReport',
    _id: 'report-fake-2024-annual',
    year: 2024,
    title: '[TEST] 2024 Annual Report',
    description:
      'Programs delivered, families served, partnerships, and financial summary for fiscal year 2024.',
  },
  {
    _type: 'annualReport',
    _id: 'report-fake-2023-audit',
    year: 2023,
    title: '[TEST] 2023 Audited Financial Statements',
  },
  {
    _type: 'annualReport',
    _id: 'report-fake-2023-990',
    year: 2023,
    title: '[TEST] 2023 Form 990',
    description: 'IRS Form 990 — annual return for tax-exempt organizations.',
  },
  {
    _type: 'annualReport',
    _id: 'report-fake-2022-annual',
    year: 2022,
    title: '[TEST] 2022 Annual Report',
    description: 'Year-end summary covering programs, fundraising, and outcomes.',
  },
]

async function run() {
  console.log(`Seeding ${fakeReports.length} fake annual reports on dataset: ${dataset}`)
  const tx = client.transaction()
  for (const r of fakeReports) {
    tx.delete(`drafts.${r._id}`)
    tx.createOrReplace(r)
    console.log(`  ✓ ${r._id} — ${r.title}`)
  }
  await tx.commit()
  console.log('Done. Hard-refresh /transparency to see them.')
  console.log('To remove: filter by "report-fake-" in Studio and delete, or:')
  console.log('  curl-or-equivalent delete *[_type=="annualReport" && _id match "report-fake-*"]')
}

run().catch((err) => {
  console.error('patch-fake-transparency-reports failed:', err.message)
  process.exit(1)
})
