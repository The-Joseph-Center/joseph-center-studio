// One-off — full content refresh for all program documents per
// build-record/28-program-pages-content-update.md.
//
// Changes:
//   - All 5 programs: visionHeading → "Where This Began", new vision body,
//     new donor copy + ask, new CTA labels, new programVideos slot
//   - program-day-shelter: title splits from "Day Shelter & Food Pantry" to
//     just "Day Shelter"; food-pantry content moves to new doc
//   - program-food-pantry: NEW document at slug "food-pantry"
//   - program-golden-girls: title → "Golden Girls Project"; "transitional"
//     replaced with "temporary"
//   - footerColumns: programs column splits the first link into two
//
// Idempotent. Safe to re-run. Existing donationsSection/resourcesSection
// content is preserved — only the programName labels on day-shelter are
// updated.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-program-content.ts --with-user-token
// Run (production — requires explicit opt-in):
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-program-content.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch program content on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-program-content.ts --with-user-token'
  )
  process.exit(1)
}

// ─── Portable-text helpers ────────────────────────────────────────────────

type Block = {
  _type: 'block'
  _key: string
  style: string
  listItem?: 'bullet' | 'number'
  level?: number
  markDefs: { _key: string; _type: string }[]
  children: { _type: 'span'; _key: string; text: string; marks: string[] }[]
}

function p(key: string, text: string, marks: string[] = []): Block {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks }],
  }
}

function h4(key: string, text: string): Block {
  return {
    _type: 'block',
    _key: key,
    style: 'h4',
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
  }
}

function li(key: string, text: string): Block {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
  }
}

// Standard donor CTAs (shared across all five programs)
const DONOR_CTAS = {
  donorCta1Label: 'Become a Financial Partner',
  donorCta1Href: '/donate',
  donorCta2Label: 'Sign Up to Volunteer',
  donorCta2Href: '/forms/volunteer',
}

// ─── Program content payloads ─────────────────────────────────────────────

const dayShelter = {
  title: 'Day Shelter',
  metaDescription:
    'A safe place to rest, shower, do laundry, and figure out what comes next — open to anyone in need in the Grand Valley.',
  visionHeading: 'Where This Began',
  visionBody:
    "We kept seeing the same thing — people in the Grand Valley who needed help but didn't know where to start. Not one resource, not one answer. Just a first step. So we built a place where anyone could walk in, catch their breath, and figure out what came next.",
  howWeHelpContent: [
    p(
      'ds-h-1',
      'The Day Shelter is open to anyone in the Grand Valley who needs a safe, welcoming place to spend the day. No paperwork. No eligibility check. Just a door that opens.'
    ),
    p('ds-h-2', 'Available Tuesday through Friday, 9am – 1pm:'),
    li('ds-h-3', 'Hot showers and laundry facilities'),
    li('ds-h-4', 'Coffee, water, and snacks'),
    li('ds-h-5', 'A warm, indoor place to rest'),
    li('ds-h-6', 'Computer and phone access for appointments and applications'),
    li('ds-h-7', 'Help connecting to housing, benefits, and other community services'),
  ],
  inlineCtas: [
    { _key: 'ds-cta-1', label: 'Contact the Day Shelter', href: '/contact', variant: 'primary' },
  ],
  personDescriptor: 'someone',
  donorIntro:
    "Right now, someone in the Grand Valley is trying to figure out what to do next. The Day Shelter is where they find out they have options — but only because people like you make it possible.\n\nThe Joseph Center is 100% community funded. For as little as $25 a month, you can be the reason someone finds their next step.",
  donorAsk: 25,
  donorAppealEnabled: true,
  programVideos: [],
  ...DONOR_CTAS,
  // Update programName labels on existing donations/resources sections
  donationsSectionName: 'Day Shelter',
  resourcesSectionName: 'Day Shelter',
}

const foodPantry = {
  _id: 'program-food-pantry',
  title: 'Food Pantry',
  slug: 'food-pantry',
  metaDescription:
    'The Joseph Center Food Pantry serves hot meals and food boxes to guests in Grand Junction every Tuesday through Friday.',
  visionHeading: 'Where This Began',
  visionBody:
    "Hunger doesn't announce itself. We saw people in the Grand Valley going without — not because food didn't exist, but because there was no consistent, welcoming place to get it. So we built one.",
  howWeHelpContent: [
    p(
      'fp-h-1',
      'A hot meal at the same time every weekday. A box of groceries to take home. No application, no questions, no proof of need.'
    ),
    p('fp-h-2', 'Every Tuesday through Friday at noon:'),
    li('fp-h-3', 'A hot lunch, served fresh'),
    li('fp-h-4', 'Take-home food boxes for the days ahead'),
    li('fp-h-5', 'Open to anyone in the Grand Valley — no eligibility check'),
    li('fp-h-6', 'A welcoming space, never a transaction'),
  ],
  inlineCtas: [
    { _key: 'fp-cta-1', label: 'Call Us', href: 'tel:+19702437672', variant: 'ghost' },
    { _key: 'fp-cta-2', label: 'Fill Out a Referral Form', href: '/forms/referral', variant: 'primary' },
  ],
  personDescriptor: 'someone',
  donorIntro:
    'A hot meal is one of the most human things one person can offer another. For as little as $15 a month, you can make sure that meal is waiting for someone who needs it in the Grand Valley.\n\nThe Joseph Center is 100% community funded — and every dollar goes directly to the people we serve.',
  donorAsk: 15, // food program rate
  donorAppealEnabled: true,
  programVideos: [],
  ...DONOR_CTAS,
}

const goldenGirls = {
  title: 'Golden Girls Project',
  metaDescription:
    'Temporary housing and Care Advocacy for women over 50 in the Grand Valley — a safe place to start over.',
  visionHeading: 'Where This Began',
  visionBody:
    'Women over 50 facing homelessness are often invisible in the system. We saw them — waiting on benefits, rebuilding after loss, starting over with nowhere stable to land. So in 2020, we built a place specifically for them.',
  howWeHelpContent: [
    p(
      'gg-h-1',
      'The Golden Girls Project provides up to six months of temporary housing for women over 50 in the Grand Valley, along with the support to use that time well. Our home has 16 beds across a shared, safe environment with full kitchen, bathroom, and laundry access.'
    ),
    h4('gg-h-2', 'Beyond housing'),
    li('gg-h-3', 'Onsite Care Advocacy — benefits navigation, ID recovery, document help'),
    li('gg-h-4', 'A monthly health clinic provided by Marillac Medical Clinic'),
    li('gg-h-5', 'Help with SNAP, Medicaid, Medicare, VA benefits, and long-term care'),
    li('gg-h-6', 'A path toward permanent, stable housing'),
    p('gg-h-7', 'An intake form is required to be accepted into the Golden Girls Project.'),
  ],
  inlineCtas: [
    { _key: 'gg-cta-1', label: 'Fill Out an Intake Form', href: '/forms/referral', variant: 'primary' },
  ],
  personDescriptor: 'a woman over 50',
  donorIntro:
    "Right now, a woman over 50 in the Grand Valley is trying to find solid ground. For as little as $25 a month, you can make sure she has a safe place to find it.\n\nThe Joseph Center is 100% community funded. Without people like you, the door doesn't stay open.",
  donorAsk: 25,
  donorAppealEnabled: true,
  programVideos: [], // TODO: Add Golden Girls program testimonial video URLs when available
  programVideosIntro:
    "These women completed the program and said yes to sharing their story. That's not a small thing.",
  ...DONOR_CTAS,
}

const financialServices = {
  title: 'Integrated Financial Services',
  metaDescription:
    'Representative Payee, guardianship, and ongoing financial support across the Western Slope for people navigating disability and benefits.',
  visionHeading: 'Where This Began',
  visionBody:
    'Across the Western Slope, we kept meeting people who were one missed payment away from losing everything — not because they were careless, but because navigating Social Security, the VA, and the financial system alone is genuinely hard. We built IFS to stand in that gap.',
  howWeHelpContent: [
    p(
      'ifs-h-1',
      'Integrated Financial Services (IFS) serves the people we work with across 16 counties on the Western Slope. We provide stability to people navigating disability and benefits — paying bills on time, protecting assets, and standing between them and the risk of homelessness. Our long-term success rate is over 98%.'
    ),
    h4('ifs-h-2', 'Representative Payee Services'),
    p(
      'ifs-h-3',
      'We manage Social Security, VA, and other benefit payments on behalf of beneficiaries — ensuring rent, utilities, and essentials are paid first, and the rest goes to the person we serve.'
    ),
    h4('ifs-h-4', 'Guardianship'),
    p(
      'ifs-h-5',
      'Court-appointed legal guardianship for people who can no longer manage their own affairs. We handle the paperwork, the reporting, and the ongoing care decisions with dignity.'
    ),
    p(
      'ifs-h-6',
      'Fees: Representative Payee — $50 per month. Guardianship — $80 per month plus filing fees. Sliding scale available for those who qualify.',
      ['em']
    ),
    h4('ifs-h-7', 'Budget Counseling'),
    p(
      'ifs-h-8',
      'One-on-one financial coaching for people who want to take more direct control of their money — building a workable budget, paying down debt, and planning for stability.'
    ),
    h4('ifs-h-9', 'Ongoing Support'),
    li('ifs-h-10', 'Bill payment and account oversight'),
    li('ifs-h-11', 'Annual benefits review and recertification help'),
    li('ifs-h-12', 'Advocacy with landlords, utilities, and government agencies'),
    li('ifs-h-13', 'Coordination with case managers, doctors, and family members'),
  ],
  inlineCtas: [
    { _key: 'ifs-cta-1', label: 'Fill Out the Form', href: '/forms/referral', variant: 'primary' },
    { _key: 'ifs-cta-2', label: 'Call Us', href: 'tel:+19702437672', variant: 'ghost' },
  ],
  personDescriptor: 'someone navigating disability and benefits',
  donorIntro:
    "Stability doesn't happen by accident. For someone navigating disability, benefits, and the risk of homelessness, having a knowledgeable guide can be the difference between housed and not.\n\nFor as little as $25 a month, you can help someone across the Western Slope build a financial foundation that holds.\n\nThe Joseph Center is 100% community funded — every dollar stays local.",
  donorAsk: 25,
  donorAppealEnabled: true,
  programVideos: [], // TODO: Add IFS anchor story video URL when available
  programVideosIntro: '',
  ...DONOR_CTAS,
}

const familyCenter = {
  title: 'Family Center',
  metaDescription:
    'Parent Advocacy and the Family Empowerment Model — walking alongside parents in Grand Junction navigating the court and child welfare systems.',
  visionHeading: 'Where This Began',
  visionBody:
    "We kept seeing scared parents — sitting in courtrooms, not sure what was happening, with no one in their corner. They weren't bad parents. They were lost in a system that's hard to navigate alone. So we built a program to walk alongside them.",
  howWeHelpContent: [
    p(
      'fc-h-1',
      'The Family Center runs our Parent Advocacy program — pairing trained advocates with parents in Grand Junction who are working through court hearings, child welfare cases, and the long road of reunification.'
    ),
    h4('fc-h-2', 'The Family Empowerment Model (FEM)'),
    p(
      'fc-h-3',
      'Our work is grounded in FEM: meeting parents where they are, building on their strengths, and walking with them through every step.'
    ),
    li('fc-h-4', 'In-court advocacy and case explanation'),
    li('fc-h-5', 'Home visits and family-strengthening support'),
    li('fc-h-6', 'Life skills coaching — parenting, budgeting, communication'),
    li('fc-h-7', 'Connection to housing, treatment, and ongoing services'),
    li('fc-h-8', 'Help understanding court orders, paperwork, and timelines'),
    p(
      'fc-h-9',
      "We're here from start to finish — for the hearing, the home visit, and the long quiet between them."
    ),
  ],
  inlineCtas: [
    { _key: 'fc-cta-1', label: 'Fill Out a Referral Form', href: '/forms/referral', variant: 'primary' },
  ],
  personDescriptor: 'a parent',
  donorIntro:
    "Right now, a parent in Grand Junction is fighting to bring their family back together. For as little as $25 a month, you can make sure they don't have to do it alone.\n\nThe Joseph Center is 100% community funded — and every dollar goes directly to the families we serve.",
  donorAsk: 25,
  donorAppealEnabled: true,
  programVideos: [], // TODO: Videos available — assign IDs when ready to publish
  programVideosIntro: '',
  ...DONOR_CTAS,
}

// ─── Patch routines ───────────────────────────────────────────────────────

type ProgramDoc = {
  _id: string
  _rev?: string
  _type: string
  [key: string]: unknown
}

async function patchExistingProgram(
  id: string,
  payload: Record<string, unknown>,
  donationsName?: string,
  resourcesName?: string,
) {
  console.log(`→ ${id}`)
  const doc = await client.fetch<ProgramDoc | null>(`*[_id == $id][0]`, { id })
  if (!doc) {
    console.warn(`  ${id} not found — skipping`)
    return
  }
  Object.assign(doc, payload)
  // Surgical updates to nested objects — preserve everything else
  if (donationsName && doc.donationsSection && typeof doc.donationsSection === 'object') {
    ;(doc.donationsSection as Record<string, unknown>).programName = donationsName
  }
  if (resourcesName && doc.resourcesSection && typeof doc.resourcesSection === 'object') {
    ;(doc.resourcesSection as Record<string, unknown>).programName = resourcesName
  }
  await client.createOrReplace(doc)
  await client.delete(`drafts.${id}`).catch(() => {})
  console.log(`  ✓ updated`)
}

async function patchFoodPantry() {
  console.log('→ program-food-pantry')
  const existing = await client.fetch<ProgramDoc | null>(
    `*[_id == "program-food-pantry"][0]`
  )

  // Pull a copy of day-shelter's donations/resources cards as a starting
  // shape if no food-pantry doc exists yet. Editors can refine in Studio.
  const dayShelterDoc = await client.fetch<ProgramDoc | null>(
    `*[_id == "program-day-shelter"][0]`
  )

  const base: ProgramDoc = existing ?? {
    _id: 'program-food-pantry',
    _type: 'program',
    donationsPageEnabled: true,
    donationsSection: dayShelterDoc?.donationsSection ?? undefined,
    resourcesSection: dayShelterDoc?.resourcesSection ?? undefined,
  }

  // Strip _id/_type/slug from payload and apply
  const { _id, slug, ...rest } = foodPantry
  Object.assign(base, rest, {
    _id,
    _type: 'program',
    slug: { _type: 'slug', current: slug },
  })

  // Update the food-pantry-specific labels if we copied them from day-shelter
  if (base.donationsSection && typeof base.donationsSection === 'object') {
    ;(base.donationsSection as Record<string, unknown>).programName = 'Food Pantry'
  }
  if (base.resourcesSection && typeof base.resourcesSection === 'object') {
    ;(base.resourcesSection as Record<string, unknown>).programName = 'Food Pantry'
  }

  await client.createOrReplace(base)
  await client.delete('drafts.program-food-pantry').catch(() => {})
  console.log(`  ✓ ${existing ? 'updated' : 'created'}`)
}

async function patchFooterColumns() {
  console.log('→ footerColumns')
  type FooterDoc = {
    _id: string
    columns?: {
      _key: string
      links?: { _key: string; label?: string; url?: string }[]
    }[]
  }
  const doc = await client.fetch<FooterDoc | null>('*[_id == "footerColumns"][0]')
  if (!doc) {
    console.warn('  footerColumns not found — skipping')
    return
  }
  const programsCol = doc.columns?.find((c) => c._key === 'col-programs')
  if (!programsCol || !programsCol.links) {
    console.warn('  col-programs not found — skipping')
    return
  }

  // Replace the first link ("Day Shelter & Food Pantry") with two links.
  // Idempotent: if the split already happened, do nothing.
  const alreadySplit = programsCol.links.some((l) => l.url === '/programs/food-pantry')
  if (alreadySplit) {
    console.log('  already split — no change')
    return
  }

  const oldFirstIdx = programsCol.links.findIndex((l) => l.url === '/programs/day-shelter')
  if (oldFirstIdx === -1) {
    console.warn('  /programs/day-shelter link not found — skipping')
    return
  }
  programsCol.links.splice(
    oldFirstIdx,
    1,
    { _key: 'p-day-shelter', label: 'Day Shelter', url: '/programs/day-shelter' } as {
      _key: string
      label?: string
      url?: string
    },
    { _key: 'p-food-pantry', label: 'Food Pantry', url: '/programs/food-pantry' } as {
      _key: string
      label?: string
      url?: string
    },
  )

  await client.createOrReplace(doc as unknown as ProgramDoc)
  await client.delete('drafts.footerColumns').catch(() => {})
  console.log('  ✓ split into two links')
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function run() {
  console.log(`Patching program content on dataset: ${dataset}`)

  // Day Shelter (strip helper-only fields before sending to Sanity)
  const { donationsSectionName: dsDonName, resourcesSectionName: dsResName, ...dsPayload } =
    dayShelter
  await patchExistingProgram('program-day-shelter', dsPayload, dsDonName, dsResName)

  await patchFoodPantry()
  await patchExistingProgram('program-golden-girls', goldenGirls)
  await patchExistingProgram('program-financial-services', financialServices)
  await patchExistingProgram('program-family-center', familyCenter)
  await patchFooterColumns()

  console.log('Done.')
}

run().catch((err) => {
  console.error('patch-program-content failed:', err.message)
  process.exit(1)
})
