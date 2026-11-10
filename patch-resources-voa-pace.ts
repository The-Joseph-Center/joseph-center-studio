// Adds the resources JC staff asked for: Volunteers of America, plus the two
// PACE programs covering the Western Slope.
//
// WHAT "VOA" TURNED OUT TO MEAN.
//
// Staff asked for VOA. A web search for "VOA" and "PACE" leads straight to
// Senior CommUnity Care — a PACE program that is indeed Volunteers of America
// — and that is almost certainly the wrong answer, for two reasons.
//
// First, there are two separate VOA entities here, and only one of them is
// local. Volunteers of America Colorado (voacolorado.org, Tax ID 84-0430995)
// has a Grand Junction office. Senior CommUnity Care prints Tax ID 13-1692595
// — the national organization's, the same one on voa.org — uses @voa.org email
// and refers to "VOANS". No VOA Colorado page mentions Senior CommUnity Care at
// all. They are different arms.
//
// Second, Senior CommUnity Care serves Montrose and Delta counties and NOT
// Mesa. The VOA that staff can walk someone to is the Grand Junction office at
// 482 28 Road, and what it runs is veteran services.
//
// That is also the better fit: SSVF exists to stop veterans becoming homeless
// and to rehouse those who already are, which is what IFS is doing from the
// other side of the same problem. Hence the pin to the IFS program page.
//
// THE COUNTY LINES, which are what decide whether a referral works:
//
//   VOA Colorado, SSVF         Delta, Garfield, Gunnison, Mesa, Moffat,
//                              Montrose, Pitkin, Rio Blanco
//   HopeWest PACE              Mesa only — Grand Junction
//   Senior CommUnity Care      Montrose, Delta — not Mesa
//
// All three are listed: JC serves the Western Slope's sixteen counties, so
// guests come from Delta and Montrose too. Each entry names its own counties,
// and the Senior CommUnity Care entry says where to go instead, because a
// Grand Junction senior sent there is turned away on the service-area test.
//
// Sources, read 10 Nov 2026, each from the organization's own site:
//   voacolorado.org/services/western-colorado      — 482 28 Road, (970) 257-3760
//   voacolorado.org/services/ssvf-western-colorado — the eight counties, intake email
//   hopewestpace.org/contact-us                    — (970) 255-7223, 2754 Compass Drive
//   hopewestpace.org/who-we-serve, /services       — Mesa zips, criteria, service list
//   seniorcommunitycare.org                        — "SERVING MONTROSE AND DELTA COUNTIES"
//   seniorcommunitycare.org/locations/enrollment   — 866-961-1451, the zip list
//
// Directory listings contradicted all of this and none of it is used here:
// a 740 Gunnison Ave address and (970) 644-5220 for VOA Grand Junction, neither
// on VOA's own pages; (855) 948-3865 for Senior CommUnity Care, nowhere on its
// own site. hopewestco.org is a trap too — its PACE pages serve a provider
// orientation manual, and its (970) 241-2212 is the general line, not PACE.
//
// NOT ADDED, deliberately: VOA Colorado's Western Colorado menu lists Meals on
// Wheels and Congregate Dining Centers, but both link out to
// mealsonwheelsmesacounty.org and no VOA page gives an address, a phone number
// or says who runs them. Probably worth listing as Meals on Wheels Mesa County
// in its own right once somebody has checked.
//
// Re-check before running this months from now; service areas and intake
// numbers change.
//
// Run from studio/:
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-resources-voa-pace.ts --with-user-token
//   CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-resources-voa-pace.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch resources on production.\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-resources-voa-pace.ts --with-user-token'
  )
  process.exit(1)
}

const resources = [
  {
    // "(VOA)" is in the title on purpose: it is what staff and guests call it,
    // and a search for "VOA" finds nothing in "Volunteers of America".
    _id: 'resource-voa-colorado-ssvf',
    _type: 'resource',
    title: 'Volunteers of America (VOA) — Veteran Services',
    url: 'https://www.voacolorado.org/services/ssvf-western-colorado/',
    description:
      'Supportive Services for Veteran Families, from the VOA office inside Western Region OneSource in Grand Junction. Outreach, case management, help claiming benefits, and emergency financial assistance — to keep a veteran and their family from losing their housing, and to rehouse quickly those who already have. Covers Delta, Garfield, Gunnison, Mesa, Moffat, Montrose, Pitkin and Rio Blanco counties. Call, or email the intake team at ssvfintake@voacolorado.org.',
    category: 'veterans',
    phone: '(970) 257-3760',
    address: '482 28 Road, Grand Junction, CO 81501 — inside Western Region OneSource',
    // IFS works with veterans at risk of homelessness; SSVF works the same
    // problem from the housing side. Each is the other's next call.
    programs: ['integrated-financial-services'],
    active: true,
    featured: false,
  },
  {
    _id: 'resource-hopewest-pace',
    _type: 'resource',
    title: 'HopeWest PACE',
    url: 'https://hopewestpace.org',
    description:
      'All-inclusive care for adults 55 and older in Mesa County who need nursing-home level support but would rather stay in their own home. One team covers primary care, prescriptions, dentistry, physical and occupational therapy, home care, nutrition, social work and hospital care, with transportation to the day centre and to appointments, and a hot lunch each weekday. Medicaid, Medicare and private payment are accepted, and there is no premium for someone on Medicaid — they will help you apply if you are not enrolled. Enrolment line answers weekdays 8am to 5pm; on-call cover is 24 hours.',
    category: 'seniors',
    phone: '(970) 255-7223',
    address: '2754 Compass Drive, Grand Junction, CO 81506',
    // Golden Girls houses women 50 and older in Grand Junction and already
    // helps residents onto Medicaid and Medicare. For a resident who is 55+
    // and in Mesa County this is the next door along.
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
      'The same all-inclusive care for adults 55 and older, run by Volunteers of America, for Montrose and Delta counties — the first PACE program on the Western Slope, with centres in Montrose and in Eckert. Eligibility is the same everywhere: 55 or older, inside the service area, assessed by the state as needing nursing-facility level of care, and able to live safely at home with PACE support. This program does not cover Mesa County — in Grand Junction, ask HopeWest PACE instead. For Montrose and Delta, Gavin can be reached directly on (970) 201-8054.',
    category: 'seniors',
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
  for (const r of resources) console.log(`  [${r.category}] ${r.title} — written`)
  console.log('\nDone.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
