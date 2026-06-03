// One-off script — populates page-home's partnersSection.partners array with
// the 24 partners pulled (read-only) from the production `home` doc's
// `partners` field. Names + URLs only; logos are intentionally omitted so
// Mona/staff can upload them via Studio against each pre-created slot.
//
// Production schema uses `name + website + logo`; staging's partnersSection
// schema uses `name + href + logo` — the script maps `website → href` and
// skips logo entirely.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-home-partners.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch page-home on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-home-partners.ts --with-user-token'
  )
  process.exit(1)
}

// Mirrors production's home.partners[] exactly (name + website), pulled
// 2026-06-02. 24 partners.
const PARTNERS = [
  { name: 'Colorado Health Foundation', href: 'https://coloradohealth.org' },
  { name: 'Hope of the Grand Valley', href: 'https://www.hopegv.org' },
  { name: 'KKCO 11 News', href: 'https://www.nbc11news.com' },
  { name: 'Grand Valley Peace & Justice', href: 'https://gvpeacejustice.org/' },
  { name: 'Mesa County Department of Human Services', href: 'https://humanservices.mesacounty.us' },
  { name: 'Western Colorado Community Foundation', href: 'https://wc-cf.org' },
  { name: 'Buell Foundation', href: 'https://buellfoundation.org' },
  { name: 'Homeward Bound of the Grand Valley', href: 'https://homewardboundgv.org/' },
  { name: 'Center for Independence', href: 'https://business.facebook.com/CFIGJ/?business_id=544447179063163' },
  { name: 'Community Food Bank', href: 'https://www.foodbankgj.org/' },
  { name: 'Grand Junction Police Department', href: 'https://gjcity.org/167/Police-Department' },
  { name: 'Front Range Clinic', href: 'https://www.frontrangemd.com/' },
  { name: 'Food Bank of the Rockies', href: 'https://www.foodbankrockies.org/' },
  { name: 'Strive', href: 'https://strivecolorado.org/' },
  { name: 'Mesa County School District 51', href: 'https://d51schools.org/' },
  { name: 'Ariel Clinic Services', href: 'https://www.arielcpa.org/' },
  { name: 'Grand Valley Catholic Outreach', href: 'http://www.catholicoutreach.org/' },
  { name: 'Hilltop', href: 'https://www.htop.org/' },
  { name: 'Next 50 Initiative', href: 'https://www.next50initiative.org/toolkit' },
  { name: 'Alpine Bank', href: 'https://www.alpinebank.com' },
  { name: 'Rocky Mountain Health Foundation', href: 'https://rmhealth.org' },
  { name: 'Church on the Rock', href: 'https://therockgj.com' },
  { name: 'Canyon View Vineyard Church', href: 'https://canyonviewchurch.com' },
  { name: 'Orchard Mesa Cruisers', href: 'https://www.omcruisers.com' },
]

function partnerKey(name: string, idx: number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  return `partner-${idx + 1}-${slug}`
}

async function run() {
  console.log(`Looking up partnersSection key on page-home in dataset: ${dataset}`)

  const home = await client.fetch<{ sections?: Array<{ _key?: string; _type?: string }> } | null>(
    `*[_id == "page-home"][0]{ sections[]{_key, _type} }`
  )

  if (!home) {
    console.error('page-home not found in staging.')
    process.exit(1)
  }

  const partnersSection = (home.sections ?? []).find((s) => s._type === 'partnersSection')
  if (!partnersSection?._key) {
    console.error('No partnersSection found on page-home. Aborting.')
    process.exit(1)
  }

  console.log(`Found partnersSection with _key="${partnersSection._key}"`)
  console.log(`Writing ${PARTNERS.length} partners…`)

  const partnerEntries = PARTNERS.map((p, idx) => ({
    _key: partnerKey(p.name, idx),
    _type: 'partnerItem',
    name: p.name,
    href: p.href,
  }))

  await client
    .patch('page-home')
    .set({ [`sections[_key=="${partnersSection._key}"].partners`]: partnerEntries })
    .commit()

  // Drop any shadow draft so Studio shows the published version.
  await client.delete('drafts.page-home').catch(() => {})

  console.log(`Done. ${partnerEntries.length} partner slots created on page-home.`)
  console.log('Upload each partner logo via Studio → Home → Partners section.')
}

run().catch((err) => {
  console.error('patch-home-partners failed:', err.message)
  process.exit(1)
})
