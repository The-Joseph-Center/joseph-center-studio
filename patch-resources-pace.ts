// Adds the two PACE programs serving the Western Slope to the Resources page.
//
// PACE is a joint Medicare/Medicaid program: one interdisciplinary team covers
// everything for an adult 55+ who meets nursing-facility level of care but
// would rather stay in their own home. Directly relevant to The Golden Girls
// Project, which houses women 50 and older and already walks residents through
// Medicaid, Medicare and long-term housing.
//
// THE THING THAT MATTERS HERE IS THE COUNTY LINE.
//
// PACE providers enrol only inside a published service area, and the two that
// cover the Western Slope do not overlap:
//
//   HopeWest PACE                 Mesa County      — Grand Junction, where JC is
//   Senior CommUnity Care (VOA)   Montrose, Delta  — not Mesa
//
// Both are listed because JC serves the Western Slope's 16 counties, so guests
// come from Delta and Montrose as well. But a Grand Junction senior pointed at
// the VOA program will be turned away on the service-area test, so each entry
// names its counties and the VOA one says where to go instead. Getting this
// wrong costs somebody a phone call they may not be able to make twice.
//
// Sources, read 10 Nov 2026, from each organization's own site — not from
// caring.com, npaonline.org or seniorsbluebook, which disagreed with each other
// on the phone numbers:
//   hopewestpace.org/contact-us         — (970) 255-7223, 2754 Compass Drive
//   hopewestpace.org/who-we-serve       — Mesa County zips, the four criteria
//   hopewestpace.org/services           — the service list
//   seniorcommunitycare.org             — "SERVING MONTROSE AND DELTA COUNTIES"
//   seniorcommunitycare.org/locations/enrollment  — 866-961-1451, the zip list
//
// Note hopewestco.org is NOT the place to look: its PACE menu item points at
// hopewestpace.org, a different host, and the pages under hopewestco.org/pace
// serve a provider orientation manual with no public PACE copy at all. The
// (970) 241-2212 on hopewestco.org is HopeWest's general line, not PACE.
//
// A directory listing also circulated (855) 948-3865 for Senior CommUnity Care.
// It appears nowhere on their own site and is not used here.
//
// Re-check both before running this months from now; service areas and
// enrolment numbers change.
//
// Run from studio/:
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-resources-pace.ts --with-user-token
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-resources-pace.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch resources on production.\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-resources-pace.ts --with-user-token'
  )
  process.exit(1)
}

const resources = [
  {
    _id: 'resource-hopewest-pace',
    _type: 'resource',
    title: 'HopeWest PACE',
    url: 'https://hopewestpace.org',
    description:
      'All-inclusive care for adults 55 and older in Mesa County who need nursing-home level support but would rather stay in their own home. One team covers primary care, prescriptions, dentistry, physical and occupational therapy, home care, nutrition, social work and hospital care, with transportation to the day centre and to appointments, and a hot lunch each weekday. Medicaid, Medicare and private payment are accepted, and there is no premium for someone on Medicaid — they will help you apply if you are not enrolled. Enrolment line answers weekdays 8am to 5pm; on-call cover is 24 hours.',
    category: 'medical',
    phone: '(970) 255-7223',
    address: '2754 Compass Drive, Grand Junction, CO 81506',
    // Golden Girls houses women 50 and older in Grand Junction and already
    // helps residents onto Medicaid and Medicare. For a resident who is 55+
    // and in Mesa County this is the next door along, so it belongs on that
    // program page rather than only on the central list.
    programs: ['golden-girls'],
    active: true,
    featured: false,
  },
  {
    _id: 'resource-senior-community-care-pace',
    _type: 'resource',
    title: 'Senior CommUnity Care of Colorado (PACE)',
    url: 'https://www.seniorcommunitycare.org',
    description:
      'The same all-inclusive care for adults 55 and older, run by Volunteers of America, for Montrose and Delta counties — the first PACE program on the Western Slope. Centres in Montrose and in Eckert. Eligibility is the same everywhere: 55 or older, inside the service area, assessed by the state as needing nursing-facility level of care, and able to live safely at home with PACE support. This program does not cover Mesa County — in Grand Junction, ask HopeWest PACE instead. For Montrose and Delta, Gavin can be reached directly on (970) 201-8054.',
    category: 'medical',
    phone: '(866) 961-1451',
    address: '2377 Robins Way, Montrose, CO 81401',
    // Deliberately not pinned to Golden Girls: that program is in Grand
    // Junction, and this provider cannot enrol anybody there.
    programs: [],
    active: true,
    featured: false,
  },
]

async function run() {
  console.log(`Dataset: ${dataset}`)
  const tx = client.transaction()
  for (const r of resources) tx.createOrReplace(r)
  await tx.commit()
  for (const r of resources) console.log(`  ${r.title} — written`)
  console.log('\nDone.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
