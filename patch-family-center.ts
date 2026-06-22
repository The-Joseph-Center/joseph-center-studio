// One-off — rewrite program-family-center per the 06/16/26 staff review:
//   • 3 populations: pregnant women, domestic violence survivors, working families
//   • Origin year: 2023
//   • Family Empowerment Model (FEM) as life-skills curriculum
//   • Drop reunification / court-focused framing
//   • Replace any "Case Management"/"Case Advocacy" with "Care Advocacy"
//
// Idempotent. Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-family-center.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch program-family-center on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-family-center.ts --with-user-token'
  )
  process.exit(1)
}

// ─── Portable-text helpers (same shape as patch-program-content.ts) ───────

type Block = {
  _type: 'block'
  _key: string
  style: string
  listItem?: 'bullet' | 'number'
  level?: number
  markDefs: { _key: string; _type: string }[]
  children: { _type: 'span'; _key: string; text: string; marks: string[] }[]
}

function p(key: string, text: string): Block {
  return {
    _type: 'block', _key: key, style: 'normal', markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
  }
}

function li(key: string, text: string): Block {
  return {
    _type: 'block', _key: key, style: 'normal', listItem: 'bullet', level: 1, markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
  }
}

const VISION_BODY =
  'In 2023, we saw an influx of pregnant women, domestic violence survivors, and working families who needed more than a referral — they needed someone in their corner. So we built a program to walk alongside them.'

const HOW_WE_HELP: Block[] = [
  p(
    'fc-h-1',
    'The Family Center is built on the Family Empowerment Model. We walk alongside unhoused pregnant women, domestic violence survivors, and working families — providing hands-on support from where they are to success.'
  ),
  p(
    'fc-h-2',
    'Our Family Empowerment Model (FEM) is a structured, life-skills curriculum. Participants learn by doing:'
  ),
  li('fc-h-3', 'Cooking and cleaning'),
  li('fc-h-4', 'Gardening'),
  li('fc-h-5', 'Job search and career readiness'),
  li('fc-h-6', 'Time management'),
  li('fc-h-7', 'Budgeting and financial skills'),
  li('fc-h-8', 'Parenting and communication'),
  p(
    'fc-h-9',
    'Beyond the curriculum, we provide wrap-around services — Care Advocacy, case explanation, and connection to housing, treatment, and ongoing services.'
  ),
  p(
    'fc-h-10',
    'So we created a safe space. Not a case file. Not a court process. A place where families can build the skills, confidence, and support network they need to move forward.'
  ),
]

const META_DESCRIPTION =
  'Family Empowerment Model (FEM) life-skills program for pregnant women, domestic violence survivors, and working families in Grand Junction.'

type Section = { _type: string; _key: string; programName?: string; learnCard?: { description?: string }; sponsorCard?: { description?: string }; donateCard?: { description?: string }; resourcesCard?: { description?: string } }
type ProgramDoc = {
  _id: string
  _rev?: string
  _type: string
  donationsSection?: Section
  resourcesSection?: Section
  [key: string]: unknown
}

async function run() {
  console.log(`Patching program-family-center on dataset: ${dataset}`)
  const doc = await client.fetch<ProgramDoc | null>('*[_id == "program-family-center"][0]')
  if (!doc) {
    console.error('program-family-center not found')
    process.exit(1)
  }

  doc.title = 'Family Center'
  doc.metaDescription = META_DESCRIPTION
  doc.visionHeading = 'Where This Began'
  doc.visionBody = VISION_BODY
  doc.howWeHelpContent = HOW_WE_HELP
  doc.inlineCtas = [
    { _key: 'fc-cta-1', label: 'Fill Out a Referral Form', href: '/forms/referral', variant: 'primary' },
  ]
  doc.personDescriptor = 'a family'

  // Cleanup card copy that referenced legal / parent advocacy framing
  if (doc.donationsSection?.sponsorCard) {
    doc.donationsSection.sponsorCard.description =
      'Sponsor Family Empowerment Model sessions and wrap-around support for the families we serve.'
  }
  if (doc.donationsSection?.donateCard) {
    doc.donationsSection.donateCard.description =
      'Your gift funds curriculum supplies, gardening materials, and the daily needs of families in the FEM program.'
  }
  if (doc.resourcesSection?.learnCard) {
    doc.resourcesSection.learnCard.description =
      'Learn about the Family Empowerment Model and how it helps pregnant women, domestic violence survivors, and working families.'
  }
  if (doc.resourcesSection?.resourcesCard) {
    doc.resourcesSection.resourcesCard.description =
      'Free resources for families including life-skills guides, parenting support, and community service connections.'
  }

  await client.createOrReplace(doc)
  await client.delete('drafts.program-family-center').catch(() => {})
  console.log('Done.')
}

run().catch((err) => {
  console.error('patch-family-center failed:', err.message)
  process.exit(1)
})
