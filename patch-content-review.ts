// One-off — applies the 06/16/26 staff review content corrections.
//
// Scope (Parts A–G of build-record/30-staff-review-content-patches.md):
//   A. Day Shelter: remove showers/laundry, add ID-required + referral-required,
//      replace narrative with the safe-space / "first step" framing.
//   B. Food Pantry: fix hours (Tue–Fri at noon), food boxes T/W/F (not Thu),
//      1 per client per month, add snack packs, drop "no application"
//      language, update donorIntro with "up to 60 meals per day."
//   C. Golden Girls: 15 beds (not 16), no "6 months" cap, add SSI/SSDI,
//      rename clinic to "Community Health Care Partners", add Peer 180 /
//      cooking / movie nights.
//   D. Board: Joe Anderson — confirmed gone; Jake & Marcie — confirmed
//      already present with isAdvisoryBoard=true. Logs and skips.
//   E. Staff: delete Penny (id confirmed by Sanity query before this run).
//   F. siteSettings: phone 243-7672 → 245-7672, address "#9" → "Ste B".
//      Also propagates through IFS/Food Pantry inline CTA tel: hrefs.
//   G. donateCard (program donations + event donations): "hygiene and
//      household products" copy + "Call Us" tel: CTA on every program.
//
// Idempotent — safe to re-run.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-content-review.ts --with-user-token
// Run (production — requires explicit opt-in):
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-content-review.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to run content review patches on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-content-review.ts --with-user-token'
  )
  process.exit(1)
}

// ── Constants ────────────────────────────────────────────────────────────

const NEW_PHONE_DISPLAY = '(970) 245-7672'
const NEW_PHONE_TEL_HREF = 'tel:+19702457672'
const NEW_ADDRESS_LINE1 = '2511 Belford Ave Ste B'

// ── Portable-text helpers (match patch-program-content.ts shape) ─────────

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

function h4(key: string, text: string): Block {
  return {
    _type: 'block', _key: key, style: 'h4', markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
  }
}

function li(key: string, text: string): Block {
  return {
    _type: 'block', _key: key, style: 'normal', listItem: 'bullet', level: 1, markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
  }
}

// ── Part A — Day Shelter ─────────────────────────────────────────────────

const DAY_SHELTER_HOW_WE_HELP: Block[] = [
  p(
    'ds-h-1',
    "The Day Shelter is that first step. When you come in, we'll help you find what you need — whether that's a computer to fill out a job application, a connection to another resource in the community, or simply a safe place to be during the day."
  ),
  p(
    'ds-h-2',
    "ID is required. A referral form is required — if you don't have one, we can help you complete it on-site."
  ),
  p('ds-h-3', 'Available Tuesday through Friday, 9am – 1pm:'),
  li('ds-h-4', 'Computer access for job applications'),
  li('ds-h-5', 'Care advocacy for housing benefits and resources'),
  li('ds-h-6', 'A warm, safe space — climate-controlled year-round'),
  p(
    'ds-h-7',
    "Not sure where to start? Come in and we'll figure it out together."
  ),
]

// ── Part B — Food Pantry ─────────────────────────────────────────────────

const FOOD_PANTRY_HOW_WE_HELP: Block[] = [
  p(
    'fp-h-1',
    'Every Tuesday through Friday at noon, we serve a hot, homemade meal. Everyone is welcome.'
  ),
  p(
    'fp-h-2',
    'For program participants across all Joseph Center programs, we also offer:'
  ),
  li(
    'fp-h-3',
    'Food boxes — available Tuesday, Wednesday, and Friday. One per client per month. ID required.'
  ),
  li('fp-h-4', 'Snack packs — for guests who need something to carry with them'),
  p(
    'fp-h-5',
    "If this is your first time, stop by the Day Shelter first — they'll help get you connected."
  ),
]

const FOOD_PANTRY_DONOR_INTRO =
  'A hot meal is one of the most human things one person can offer another. On average, we serve up to 60 meals per day — but only because people like you make it possible.\n\nThe Joseph Center is 100% community & foundation funded — and every dollar goes directly to the people we serve.'

// ── Part C — Golden Girls Project ────────────────────────────────────────

const GOLDEN_GIRLS_HOW_WE_HELP: Block[] = [
  p(
    'gg-h-1',
    'The Golden Girls Project provides free temporary housing for women over 50 with a goal of stable, permanent housing within a year. Our house is a warm, shared space — 15 beds, a full kitchen, bathroom facilities, and laundry on-site.'
  ),
  p('gg-h-2', 'An intake form is required to be accepted into the program.'),
  h4('gg-h-3', 'Beyond housing, we walk alongside each resident through'),
  li('gg-h-4', 'Whole-person Care Advocacy'),
  li('gg-h-5', 'Navigating SSI, SSDI, SNAP, Medicaid, Medicare, and VA resources'),
  li('gg-h-6', 'Budgeting classes with a goal of 30% in savings'),
  li('gg-h-7', 'Connections to medical and mental health providers'),
  li('gg-h-8', 'Employment resources and document help through the workforce center'),
  li(
    'gg-h-9',
    'On-site health clinic, last Wednesday of each month, provided by Community Health Care Partners'
  ),
  li(
    'gg-h-10',
    'Monthly tea party at Peer 180, cooking classes, and movie nights — because community matters too'
  ),
]

// ── donateCard for in-kind donations (Part G) ────────────────────────────

const DONATE_CARD_NEW = {
  enabled: true,
  title: 'Donate Supplies',
  description:
    "We always need hygiene and household products. Please call us first — we manage donations by phone to make sure we can receive what you'd like to bring.",
  buttonLabel: 'Call Us',
  buttonHref: NEW_PHONE_TEL_HREF,
}

// ── Patch helpers ────────────────────────────────────────────────────────

type ProgramDoc = {
  _id: string
  _rev?: string
  _type: string
  inlineCtas?: { _key: string; label?: string; href?: string; variant?: string }[]
  donationsSection?: {
    donateCard?: Record<string, unknown>
    sponsorCard?: Record<string, unknown>
    [k: string]: unknown
  }
  [key: string]: unknown
}

async function applyProgramPatch(
  id: string,
  mutate: (doc: ProgramDoc) => boolean,
) {
  const doc = await client.fetch<ProgramDoc | null>(`*[_id == $id][0]`, { id })
  if (!doc) {
    console.warn(`  ${id}: not found — skipping`)
    return
  }
  const changed = mutate(doc)
  if (!changed) {
    console.log(`  ${id}: no change`)
    return
  }
  await client.createOrReplace(doc)
  await client.delete(`drafts.${id}`).catch(() => {})
  console.log(`  ${id}: updated`)
}

function updatePhoneInCtas(doc: ProgramDoc): boolean {
  if (!Array.isArray(doc.inlineCtas)) return false
  let touched = false
  for (const cta of doc.inlineCtas) {
    if (cta.href && /^tel:\+?1?9702437672$/.test(cta.href)) {
      cta.href = NEW_PHONE_TEL_HREF
      touched = true
    }
  }
  return touched
}

function applyDonateCard(doc: ProgramDoc): boolean {
  if (!doc.donationsSection) return false
  const current = doc.donationsSection.donateCard || {}
  const next = { ...current, ...DONATE_CARD_NEW }
  doc.donationsSection.donateCard = next
  // Compare to detect a real change vs noise
  const before = JSON.stringify(current)
  const after = JSON.stringify(next)
  return before !== after
}

// ── Main ─────────────────────────────────────────────────────────────────

async function run() {
  console.log(`Applying content review patches on dataset: ${dataset}`)

  // Part A — Day Shelter
  console.log('\n→ Part A — Day Shelter (program-day-shelter)')
  await applyProgramPatch('program-day-shelter', (doc) => {
    doc.howWeHelpContent = DAY_SHELTER_HOW_WE_HELP
    updatePhoneInCtas(doc)
    applyDonateCard(doc)
    return true
  })

  // Part B — Food Pantry
  console.log('\n→ Part B — Food Pantry (program-food-pantry)')
  await applyProgramPatch('program-food-pantry', (doc) => {
    doc.howWeHelpContent = FOOD_PANTRY_HOW_WE_HELP
    doc.donorIntro = FOOD_PANTRY_DONOR_INTRO
    updatePhoneInCtas(doc)
    applyDonateCard(doc)
    return true
  })

  // Part C — Golden Girls Project
  console.log('\n→ Part C — Golden Girls Project (program-golden-girls)')
  await applyProgramPatch('program-golden-girls', (doc) => {
    doc.howWeHelpContent = GOLDEN_GIRLS_HOW_WE_HELP
    updatePhoneInCtas(doc)
    applyDonateCard(doc)
    return true
  })

  // Part F + G — remaining program donate cards + phone in CTAs
  console.log('\n→ Parts F/G — remaining programs (CTAs + donate card)')
  await applyProgramPatch('program-financial-services', (doc) => {
    const a = updatePhoneInCtas(doc)
    const b = applyDonateCard(doc)
    return a || b
  })
  await applyProgramPatch('program-family-center', (doc) => {
    const a = updatePhoneInCtas(doc)
    const b = applyDonateCard(doc)
    return a || b
  })

  // Part G — page-event-donations donate card
  console.log('\n→ Part G — page-event-donations donate card')
  const eventDoc = await client.fetch<{
    _id: string
    sections?: { _key: string; _type: string; donateCard?: Record<string, unknown> }[]
  } | null>(`*[_id == "page-event-donations"][0]`)
  if (eventDoc?.sections) {
    let touched = false
    for (const section of eventDoc.sections) {
      if (section._type === 'programDonationsSection' && section.donateCard) {
        const before = JSON.stringify(section.donateCard)
        section.donateCard = { ...section.donateCard, ...DONATE_CARD_NEW }
        if (JSON.stringify(section.donateCard) !== before) touched = true
      }
    }
    if (touched) {
      await client.createOrReplace(eventDoc as { _id: string; _type: string })
      await client.delete('drafts.page-event-donations').catch(() => {})
      console.log('  page-event-donations: updated')
    } else {
      console.log('  page-event-donations: no change')
    }
  } else {
    console.warn('  page-event-donations: not found — skipping')
  }

  // Part F — siteSettings: phone + address
  console.log('\n→ Part F — siteSettings (phone + address)')
  await client
    .patch('siteSettings')
    .set({
      'businessContact.phone': NEW_PHONE_DISPLAY,
      'businessContact.addressLine1': NEW_ADDRESS_LINE1,
    })
    .commit()
  await client.delete('drafts.siteSettings').catch(() => {})
  console.log(`  siteSettings: phone → ${NEW_PHONE_DISPLAY}, addressLine1 → ${NEW_ADDRESS_LINE1}`)

  // Part F — legal pages address + phone (these are page docs with hardcoded text)
  console.log('\n→ Part F — legal pages text replacements')
  type LegalPage = { _id: string; sections?: unknown[] }
  const legalIds = ['legal-privacy-policy', 'legal-terms-and-conditions', 'legal-accessibility']
  for (const id of legalIds) {
    const doc = await client.fetch<LegalPage | null>(`*[_id == $id][0]`, { id })
    if (!doc) {
      console.log(`  ${id}: not found — skipping`)
      continue
    }
    const json = JSON.stringify(doc)
    const replaced = json
      .replace(/2511 Belford Ave #9/g, NEW_ADDRESS_LINE1)
      .replace(/\(970\) 243-7672/g, NEW_PHONE_DISPLAY)
      .replace(/tel:\+?1?9702437672/g, NEW_PHONE_TEL_HREF)
    if (replaced === json) {
      console.log(`  ${id}: no match`)
      continue
    }
    const next = JSON.parse(replaced) as { _id: string; _type: string }
    await client.createOrReplace(next)
    await client.delete(`drafts.${id}`).catch(() => {})
    console.log(`  ${id}: text replaced`)
  }

  // Part D — board changes
  console.log('\n→ Part D — Board (Joe Anderson + Jake/Marcie)')
  const joe = await client.fetch<{ _id: string }[] | null>(
    `*[_type == "board" && (name match "Joe*" || name match "*Anderson*")]{_id}`
  )
  if (joe && joe.length) {
    for (const row of joe) {
      await client.delete(row._id)
      console.log(`  deleted ${row._id} (Joe Anderson)`)
    }
  } else {
    console.log('  Joe Anderson: not found (already removed)')
  }
  const advisory = await client.fetch<{ _id: string; name: string; isAdvisoryBoard?: boolean }[]>(
    `*[_type == "board" && (name == "Jake" || name == "Marcie")]{_id, name, isAdvisoryBoard}`
  )
  for (const row of advisory) {
    console.log(`  ${row.name} (${row._id}): isAdvisoryBoard=${row.isAdvisoryBoard ?? null} (already present)`)
  }

  // Part E — delete Penny
  console.log('\n→ Part E — Staff (delete Penny)')
  const penny = await client.fetch<{ _id: string }[]>(
    `*[_type == "staff" && name match "Penny*"]{_id}`
  )
  if (penny.length) {
    for (const row of penny) {
      await client.delete(row._id)
      console.log(`  deleted ${row._id} (Penny)`)
    }
  } else {
    console.log('  Penny: not found (already removed)')
  }

  console.log('\nDone.')
}

run().catch((err) => {
  console.error('patch-content-review failed:', err.message)
  process.exit(1)
})
