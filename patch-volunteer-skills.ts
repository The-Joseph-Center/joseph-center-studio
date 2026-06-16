// One-off — creates the volunteerSkills singleton doc with the spec's
// default categories + skill list. Idempotent: if the doc already exists,
// it's replaced wholesale (you can edit in Studio after first run).
//
// The spec notes the skill list is intentionally broad and will be narrowed
// after staff review. Editors can do that directly in Studio.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-volunteer-skills.ts --with-user-token
// Run (production):
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-volunteer-skills.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch volunteerSkills on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-volunteer-skills.ts --with-user-token'
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
      skills: ['Photography', 'Videography', 'Graphic Design', 'Social Media'],
    },
    {
      _key: 'cat-legal',
      _type: 'skillCategory',
      name: 'Legal & Financial',
      skills: ['Legal / Attorney', 'Accounting / Bookkeeping', 'Financial Counseling'],
    },
    {
      _key: 'cat-medical',
      _type: 'skillCategory',
      name: 'Medical & Wellness',
      skills: ['Medical / Nursing', 'Mental Health / Counseling', 'Dental'],
    },
    {
      _key: 'cat-trades',
      _type: 'skillCategory',
      name: 'Trades & Facilities',
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
      skills: [
        'Transportation / Driving',
        'Teaching / Tutoring',
        'IT / Technology',
        'Grant Writing',
        'Translation / Interpretation',
      ],
    },
  ],
}

async function run() {
  console.log(`Seeding volunteerSkills on dataset: ${dataset}`)
  await client.createOrReplace(doc)
  await client.delete('drafts.volunteerSkills').catch(() => {})
  console.log('Done.')
}

run().catch((err) => {
  console.error('patch-volunteer-skills failed:', err.message)
  process.exit(1)
})
