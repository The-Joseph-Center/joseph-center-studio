// One-off — seeds the new `departments` field on staff documents.
//
// Departments drive the "Meet the Team" section at the bottom of each program
// page (frontend/src/components/sections/ProgramStaffSection.vue). The mapping
// from program slug to department lives in frontend/src/lib/departments.ts:
//
//   day-shelter                   → day-shelter
//   family-center                 → family-center
//   golden-girls                  → golden-girls
//   integrated-financial-services → ifs
//   food-pantry                   → kitchen
//
// The four remaining departments (it-marketing, maintenance, security,
// operations) are internal — staff in them appear on /staff only.
//
// Assignments below are derived from each person's role title. The ones marked
// INFERRED are educated guesses and should be confirmed by JC staff in Studio;
// the field is a plain multi-select, so correcting one is a two-click job.
//
// Only writes staff who currently have NO departments set, so a human
// correction in Studio is never clobbered by a re-run. Idempotent.
//
// Run (staging):
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-staff-departments.ts --with-user-token
// Run (production — requires explicit opt-in):
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-staff-departments.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to run staff department patches on production.\n' +
      'Re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-staff-departments.ts --with-user-token'
  )
  process.exit(1)
}

// Keyed by the staff document's `name` (first name — the schema's natural key).
const ASSIGNMENTS: Record<string, { departments: string[]; inferred?: boolean }> = {
  Eva:     { departments: ['day-shelter'] },                  // title: "Day Shelter"
  Gerald:  { departments: ['maintenance'] },                  // title: "Maintenance"
  Eric:    { departments: ['it-marketing'] },                 // "Director of Technology & Marketing"
  Breawna: { departments: ['ifs'] },                          // "IFS Supervisor"
  Jennifer:{ departments: ['golden-girls'] },                 // "Golden Girls Project Director"
  Paula:   { departments: ['golden-girls'] },                 // "Golden Girls Project Assistant"
  Marty:   { departments: ['kitchen'] },                      // "Director of Food Services and Pantry"
  Luisa:   { departments: ['kitchen'] },                      // "Food Service Assistant"

  // INFERRED — Representative Payee is an IFS function, but confirm.
  Bianca:  { departments: ['ifs'], inferred: true },
  Jalina:  { departments: ['ifs'], inferred: true },

  // INFERRED — administrative/leadership roles with no obvious program home.
  Mona:    { departments: ['operations'], inferred: true },   // "Executive Director"
  Shawna:  { departments: ['operations'], inferred: true },   // "Co-Founder and Operations Director"
  Khira:   { departments: ['operations'], inferred: true },   // "Executive Assistant"
  Deanna:  { departments: ['operations'], inferred: true },   // "Donations Coordinator"
  Jessica: { departments: ['operations'], inferred: true },   // "Outreach / Events Coordinator"
}

async function run() {
  const staff: { _id: string; name?: string; title?: string; departments?: string[] }[] =
    await client.fetch(`*[_type == "staff" && !(_id in path("drafts.**"))]{_id, name, title, departments}`)

  console.log(`Dataset: ${dataset} — ${staff.length} staff document(s)\n`)

  let patched = 0
  let skipped = 0
  const unmapped: string[] = []
  const inferred: string[] = []

  for (const person of staff) {
    const key = (person.name ?? '').trim()
    const assignment = ASSIGNMENTS[key]

    if (!assignment) {
      unmapped.push(`${key || person._id} (${person.title ?? 'no title'})`)
      continue
    }

    if (person.departments?.length) {
      console.log(`  skip   ${key} — already set to [${person.departments.join(', ')}]`)
      skipped++
      continue
    }

    await client.patch(person._id).set({ departments: assignment.departments }).commit()
    console.log(`  patch  ${key} → [${assignment.departments.join(', ')}]${assignment.inferred ? '  (INFERRED)' : ''}`)
    patched++
    if (assignment.inferred) inferred.push(`${key} — ${person.title ?? ''} → ${assignment.departments.join(', ')}`)
  }

  console.log(`\nPatched ${patched}, skipped ${skipped} (already set).`)

  if (inferred.length) {
    console.log('\nCONFIRM THESE WITH JC STAFF — assigned by inference, not by an explicit role name:')
    for (const line of inferred) console.log(`  • ${line}`)
  }

  if (unmapped.length) {
    console.log('\nNo assignment defined (left blank — will appear on /staff only):')
    for (const line of unmapped) console.log(`  • ${line}`)
  }

  // Surface program pages that will render no team section.
  const PROGRAM_DEPARTMENTS = ['day-shelter', 'family-center', 'golden-girls', 'ifs', 'kitchen']
  const after: { departments?: string[] }[] =
    await client.fetch(`*[_type == "staff" && !(_id in path("drafts.**"))]{departments}`)
  const covered = new Set(after.flatMap((p) => p.departments ?? []))
  const empty = PROGRAM_DEPARTMENTS.filter((d) => !covered.has(d))
  if (empty.length) {
    console.log(`\nProgram departments with NO staff assigned (their "Meet the Team" section stays hidden): ${empty.join(', ')}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
