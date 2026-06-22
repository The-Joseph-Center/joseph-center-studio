// One-off — populates the home page programsGrid section with heading
// + programs[]. Currently the section is empty in Sanity and the frontend
// renders entirely from a hardcoded fallback in ProgramsGrid.vue, so editors
// see nothing in the CMS. This brings them into sync.
//
// Idempotent. Re-runnable safely.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-home-programs-grid.ts --with-user-token
// Run (production):
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-home-programs-grid.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch programsGrid on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-home-programs-grid.ts --with-user-token'
  )
  process.exit(1)
}

const HEADING = 'Our Programs'

const PROGRAMS = [
  {
    _key: 'pg-day-shelter',
    name: 'Day Shelter',
    description:
      'A safe place to rest, shower, do laundry, and figure out what comes next — open to anyone in the Grand Valley.',
    href: '/programs/day-shelter',
  },
  {
    _key: 'pg-food-pantry',
    name: 'Food Pantry',
    description:
      'Hot meals and food boxes for our guests in Grand Junction, every Tuesday through Friday.',
    href: '/programs/food-pantry',
  },
  {
    _key: 'pg-family-center',
    name: 'Family Center',
    description:
      'Parent Advocacy and the Family Empowerment Model — walking alongside parents working toward reunification.',
    href: '/programs/family-center',
  },
  {
    _key: 'pg-financial-services',
    name: 'Integrated Financial Services',
    description:
      'Representative Payee, guardianship, and budget counseling across 16 counties of the Western Slope.',
    href: '/programs/integrated-financial-services',
  },
  {
    _key: 'pg-golden-girls',
    name: 'Golden Girls Project',
    description:
      'Temporary housing and case management for women over 50 starting over in the Grand Valley.',
    href: '/programs/golden-girls',
  },
]

type Section = { _type: string; _key: string; heading?: string; programs?: unknown[] }
type PageHome = { _id: string; _rev: string; sections: Section[] }

async function run() {
  console.log(`Patching page-home programsGrid on dataset: ${dataset}`)
  const doc = await client.fetch<PageHome | null>('*[_id == "page-home"][0]')
  if (!doc) {
    console.error('page-home not found')
    process.exit(1)
  }
  const section = doc.sections.find((s) => s._type === 'programsGrid')
  if (!section) {
    console.error('programsGrid section not found on page-home')
    process.exit(1)
  }
  section.heading = HEADING
  section.programs = PROGRAMS
  await client.createOrReplace(doc)
  await client.delete('drafts.page-home').catch(() => {})
  console.log('Done.')
}

run().catch((err) => {
  console.error('patch-home-programs-grid failed:', err.message)
  process.exit(1)
})
