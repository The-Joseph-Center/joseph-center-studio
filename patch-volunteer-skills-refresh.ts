// One-off — restructure the volunteerSkills singleton per the 06/16/26 staff
// review follow-up:
//   • Media & Creative: drop "Social Media" (keep Photography, Videography,
//     Graphic Design)
//   • Legal & Financial: keep the category data but hide via active=false
//     so it can be re-enabled later without re-typing
//   • Medical & Wellness: drop "Mental Health / Counseling", add "Vision"
//   • Trades & Facilities: unchanged
//   • Other: drop "Translation / Interpretation" generic, split into
//     Spanish, Sign Language (ASL), Other Language; drop "IT / Technology"
//     per spec
//
// Idempotent — overwrites the singleton wholesale.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-volunteer-skills-refresh.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch volunteerSkills on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-volunteer-skills-refresh.ts --with-user-token'
  )
  process.exit(1)
}

const doc = {
  _type: 'volunteerSkills',
  _id: 'volunteerSkills',
  categories: [
    {
      _key: 'cat-media',
      _type: 'skillCategory',
      name: 'Media & Creative',
      active: true,
      skills: ['Photography', 'Videography', 'Graphic Design'],
    },
    {
      _key: 'cat-legal',
      _type: 'skillCategory',
      name: 'Legal & Financial',
      active: false, // hidden from form but kept in case staff wants to re-enable
      skills: ['Legal / Attorney', 'Accounting / Bookkeeping', 'Financial Counseling'],
    },
    {
      _key: 'cat-medical',
      _type: 'skillCategory',
      name: 'Medical & Wellness',
      active: true,
      skills: ['Medical / Nursing', 'Dental', 'Vision'],
    },
    {
      _key: 'cat-trades',
      _type: 'skillCategory',
      name: 'Trades & Facilities',
      active: true,
      skills: [
        'Carpentry / Repairs',
        'Plumbing',
        'Electrical',
        'Landscaping / Groundskeeping',
        'Painting',
      ],
    },
    {
      _key: 'cat-other',
      _type: 'skillCategory',
      name: 'Other',
      active: true,
      skills: [
        'Transportation / Driving',
        'Teaching / Tutoring',
        'Grant Writing',
        'Spanish Interpretation',
        'Sign Language (ASL) Interpretation',
        'Other Language Interpretation',
      ],
    },
  ],
}

async function run() {
  console.log(`Refreshing volunteerSkills on dataset: ${dataset}`)
  await client.createOrReplace(doc)
  await client.delete('drafts.volunteerSkills').catch(() => {})
  console.log('Done.')
}

run().catch((err) => {
  console.error('patch-volunteer-skills-refresh failed:', err.message)
  process.exit(1)
})
