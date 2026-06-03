// One-off script — patches the four program documents with the donations +
// resources page content added in 10-program-donations-pages.md.
//
// The regular seed.ts uses createIfNotExists and won't update existing docs.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-programs-donations.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to patch program docs on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-programs-donations.ts --with-user-token'
  )
  process.exit(1)
}

interface ProgramPatch {
  _id: string
  donationsSection: Record<string, unknown>
  resourcesSection: Record<string, unknown>
}

const programs: ProgramPatch[] = [
  {
    _id: 'program-day-shelter',
    donationsSection: {
      programName: 'Day Shelter & Food Pantry',
      sponsorCard: {
        enabled: true,
        title: 'Sponsor an Event',
        description: 'Sponsor a meal service or shelter event. Your sponsorship directly supports the people we serve.',
        buttonLabel: 'Contact Us',
        buttonHref: '/contact',
      },
      donateCard: {
        enabled: true,
        title: 'Donate Supplies',
        description: 'We accept donations of food, clothing, hygiene products, and household supplies. Every item makes a difference.',
        buttonLabel: 'Give',
        buttonHref: '/donate',
      },
    },
    resourcesSection: {
      programName: 'Day Shelter & Food Pantry',
      learnCard: {
        enabled: true,
        title: 'Learn',
        description: 'Learn about food insecurity and homelessness in Mesa County and how The Joseph Center is responding.',
        buttonLabel: 'Learn More',
        buttonHref: '/our-story',
      },
      resourcesCard: {
        enabled: true,
        title: 'Free Resources',
        description: 'Access our list of free community resources including food assistance, housing support, and more.',
        buttonLabel: 'Learn More',
        buttonHref: '/our-story',
      },
    },
  },
  {
    _id: 'program-golden-girls',
    donationsSection: {
      programName: 'Golden Girls',
      sponsorCard: {
        enabled: true,
        title: 'Sponsor an Event',
        description: 'Sponsor a Golden Girl for a month and help provide housing, food, and case management support.',
        buttonLabel: 'Contact Us',
        buttonHref: '/contact',
      },
      donateCard: {
        enabled: true,
        title: 'Donate Supplies',
        description: 'Household items, clothing, and personal care products make an immediate impact for women in transition.',
        buttonLabel: 'Give',
        buttonHref: '/donate',
      },
    },
    resourcesSection: {
      programName: 'Golden Girls',
      learnCard: {
        enabled: true,
        title: 'Learn',
        description: 'Learn about the challenges women over 50 face with housing and how transitional programs change outcomes.',
        buttonLabel: 'Learn More',
        buttonHref: '/our-story',
      },
      resourcesCard: {
        enabled: true,
        title: 'Free Resources',
        description: 'Resources for women navigating housing, benefits, and senior services in the Grand Valley.',
        buttonLabel: 'Learn More',
        buttonHref: '/our-story',
      },
    },
  },
  {
    _id: 'program-financial-services',
    donationsSection: {
      programName: 'IFS',
      sponsorCard: {
        enabled: true,
        title: 'Sponsor an Event',
        description: 'Sponsor financial services support for a disabled individual and help them achieve stability and independence.',
        buttonLabel: 'Contact Us',
        buttonHref: '/contact',
      },
      donateCard: {
        enabled: true,
        title: 'Donate Supplies',
        description: 'Your gift funds financial coaching, guardianship services, and benefit navigation for those who need it most.',
        buttonLabel: 'Give',
        buttonHref: '/donate',
      },
    },
    resourcesSection: {
      programName: 'IFS',
      learnCard: {
        enabled: true,
        title: 'Learn',
        description: 'Learn about financial management services, guardianship, and how we help individuals with disabilities.',
        buttonLabel: 'Learn More',
        buttonHref: '/our-story',
      },
      resourcesCard: {
        enabled: true,
        title: 'Free Resources',
        description: 'Access free financial literacy resources, VA benefit guides, and community support links.',
        buttonLabel: 'Learn More',
        buttonHref: '/our-story',
      },
    },
  },
  {
    _id: 'program-family-center',
    donationsSection: {
      programName: 'Family Center',
      sponsorCard: {
        enabled: true,
        title: 'Sponsor an Event',
        description: 'Sponsor parent advocacy services and help families navigate the legal system to stay together.',
        buttonLabel: 'Contact Us',
        buttonHref: '/contact',
      },
      donateCard: {
        enabled: true,
        title: 'Donate Supplies',
        description: 'Your donation funds parent support services and resources for families in crisis.',
        buttonLabel: 'Give',
        buttonHref: '/donate',
      },
    },
    resourcesSection: {
      programName: 'Family Center',
      learnCard: {
        enabled: true,
        title: 'Learn',
        description: 'Learn about parent advocacy and the legal challenges families face in the Grand Junction area.',
        buttonLabel: 'Learn More',
        buttonHref: '/our-story',
      },
      resourcesCard: {
        enabled: true,
        title: 'Free Resources',
        description: 'Free resources for parents including legal aid guides, support groups, and family services contacts.',
        buttonLabel: 'Learn More',
        buttonHref: '/our-story',
      },
    },
  },
]

async function run() {
  console.log(`Patching ${programs.length} program docs on dataset: ${dataset}`)
  const tx = client.transaction()
  for (const p of programs) {
    tx.patch(p._id, (patch) =>
      patch.set({
        donationsPageEnabled: true,
        donationsSection: p.donationsSection,
        resourcesSection: p.resourcesSection,
      })
    )
  }
  await tx.commit()
  console.log('Program docs patched. Hard-refresh the frontend to see donations pages.')
}

run().catch((err) => {
  console.error('patch-programs-donations failed:', err.message)
  process.exit(1)
})
