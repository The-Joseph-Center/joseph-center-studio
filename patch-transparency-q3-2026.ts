// The transparency page, updated through 30 September 2026.
//
// Built from "Annual Report 2026.pdf" (which is the year to date, January to
// September) rather than from the quarter sheet, because the page shows the
// year so far rather than one quarter.
//
// Two figures are deliberately NOT taken from that sheet. Its donations block
// has an arithmetic fault: the Operations column subtotals to 345,836.84 while
// its own rows add to 323,436.84 — overstated by exactly 22,400.00. Nothing
// published here uses that column. The Total column, the spending block and
// every row across are internally consistent, and those are what the page
// shows. The fault is reported rather than silently corrected: the books are
// Sarah's to fix, not ours.
//
// Run from studio/:
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-transparency-q3-2026.ts --with-user-token
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-transparency-q3-2026.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch the transparency page on production.\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-transparency-q3-2026.ts --with-user-token'
  )
  process.exit(1)
}

const PERIOD = 'January – September 2026'

/** Donations by source, from the Total column. Sums to 401,615.74. */
const allocations = [
  { label: 'Businesses & Organizations', note: 'Local businesses and community partners', value: 149898.98 },
  { label: 'Foundations', note: 'Grants from charitable foundations', value: 112829.03 },
  { label: 'Designated Gifts', note: 'Given for a specific program', value: 56400.0 },
  { label: 'Individual Donors', note: 'Neighbors across the Western Slope', value: 52186.2 },
  { label: 'Churches', note: 'Congregations across the valley', value: 28345.0 },
  { label: 'Fundraisers', note: 'Community events', value: 1902.0 },
  // Small enough to look odd on a chart, and left in anyway: without it the
  // slices do not add up to the total the page states, and a reader who adds
  // them up is exactly the reader this page is for.
  { label: 'Grants', note: 'Government and other grant income', value: 54.53 },
]

/**
 * Spending by program, from the spending block's column totals.
 *
 * Direct Client Support combines Client Assistance (17,456.88) with the GAP
 * fund (44,547.43), the way the previous version did: both are money that
 * reaches a person rather than running a program, and GAP is not advertised
 * publicly as a program of its own. Sums to 639,310.42.
 */
const spending = [
  { label: 'Shared Operations', note: 'Building, staff and services every program relies on', value: 312486.55 },
  { label: 'Family Center', note: 'Parent advocacy and family support', value: 76128.88 },
  { label: 'Golden Girls Project', note: 'Housing and support for women 50 and older', value: 74306.46 },
  { label: 'Integrated Financial Services', note: 'Representative payee and financial advocacy', value: 65142.64 },
  { label: 'Direct Client Support', note: 'Emergency assistance reaching a person directly', value: 62004.31 },
  { label: 'Day Shelter', note: 'Daytime shelter, laundry and computer access', value: 49241.58 },
]

const MONETARY = 401615.74
const IN_KIND = 114090.0
const SPENT = 639310.42

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

async function run() {
  const page = await client.fetch<{ _id: string; sections?: { _key: string; _type: string }[] } | null>(
    `*[_type=="page" && slug.current=="/transparency"][0]{_id, sections[]{_key,_type}}`
  )
  if (!page) {
    console.error('No /transparency page in this dataset.')
    process.exit(1)
  }
  const index = (page.sections ?? []).findIndex((s) => s._type === 'transparencySection')
  if (index === -1) {
    console.error('The transparency page has no transparencySection.')
    process.exit(1)
  }

  console.log(`Dataset: ${dataset}`)
  console.log(`  monetary ${money(MONETARY)} · in-kind ${money(IN_KIND)} · spent ${money(SPENT)}`)
  console.log(`  sources add to ${money(allocations.reduce((n, a) => n + a.value, 0))}`)
  console.log(`  spending adds to ${money(spending.reduce((n, a) => n + a.value, 0))}`)

  await client
    .patch(page._id)
    .set({
      [`sections[${index}].allocationPeriod`]: PERIOD,
      [`sections[${index}].spendingPeriod`]: PERIOD,
      [`sections[${index}].allocations`]: allocations.map((a, i) => ({
        _key: `alloc-${i}`, _type: 'allocation', ...a,
      })),
      [`sections[${index}].spending`]: spending.map((a, i) => ({
        _key: `spend-${i}`, _type: 'allocation', ...a,
      })),
      [`sections[${index}].intro`]:
        `Between January and September 2026, our community gave ${money(MONETARY)} in monetary donations and a further ` +
        `${money(IN_KIND)} in donated goods and services. Over the same nine months we spent ${money(SPENT)} supporting ` +
        `the people who come to us. The Joseph Center is community and foundation funded — we take no federal or state ` +
        `grants, so every figure below comes from our neighbors.`,
      [`sections[${index}].allocationFootnote`]:
        `Monetary gifts only. In-kind support of ${money(IN_KIND)} over the same period is counted separately, since it ` +
        `is given as goods and services rather than money. Figures are unaudited.`,
      [`sections[${index}].spendingFootnote`]:
        `Total spending over the period was ${money(SPENT)}, against ${money(MONETARY + IN_KIND)} received. ` +
        `Figures are unaudited.`,
    })
    .commit()

  console.log('\nUpdated.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
