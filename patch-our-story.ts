// One-off script — overwrites the `page-our-story` document with the canonical
// section structure from 11-our-story-page.md. The existing doc in staging was
// seeded as an empty scaffold (heroSection-0, splitSection-1, textContent-2,
// pricingCtaSection-3 with no content); regular seed.ts uses createIfNotExists
// and won't replace it. createOrReplace overwrites cleanly.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-our-story.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to overwrite page-our-story on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-our-story.ts --with-user-token'
  )
  process.exit(1)
}

const pageOurStory = {
  _type: 'page',
  _id: 'page-our-story',
  title: 'Our Story',
  slug: { _type: 'slug', current: '/our-story' },
  sections: [
    {
      _type: 'heroSection',
      _key: 'hero-our-story',
      title: 'Our Story',
      align: 'right',
      minHeight: '55vh',
      showStripe: true,
      stripeColor: 'gold',
    },
    {
      _type: 'videoSection',
      _key: 'video-our-story',
      introText: 'Hear from Mona Highline, Founder and CEO, about the vision of The Joseph Center.',
      videoId: '',
      placeholderLabel: 'Video coming soon',
    },
    {
      _type: 'textContent',
      _key: 'vision-our-story',
      heading: 'Our Vision',
      alignment: 'center',
      textTransform: 'uppercase',
      body: [
        {
          _type: 'block', _key: 'vis-1', style: 'normal', markDefs: [],
          children: [{ _type: 'span', _key: 'vis-1s', marks: [],
            text: 'We support people in need of hope by restoring dignity through resources and encouragement to regain a sense of belonging to the greater community.',
          }],
        },
      ],
    },
    {
      _type: 'diagonalTextSection',
      _key: 'narrative-our-story',
      title: 'Our Story',
      color: 'gold',
      body: [
        {
          _type: 'block', _key: 'n-1', style: 'normal', markDefs: [],
          children: [{ _type: 'span', _key: 'n-1s', marks: [],
            text: "The concept of a Joseph Center was a long-standing vision of the founder Mona Highline. In 2015, Mrs. Highline and a group of women came together to establish The Joseph Center. During a community needs assessment, the women discovered a gap in services for homeless women with their children. An auxiliary building at a church was offered to the women to open as a day shelter. The Joseph Center opened its doors September 8, 2016 to provide a safe place during the day for homeless women and their children. The mission was to provide resources to empower these women's lives with purpose.",
          }],
        },
        {
          _type: 'block', _key: 'n-2', style: 'normal', markDefs: [],
          children: [{ _type: 'span', _key: 'n-2s', marks: [],
            text: 'The Joseph Center was able to help these families with long-term housing, employment, food, and many other supportive services. Initially the Joseph Center was located at the auxiliary building for about a year, when the church came under new leadership. We were asked to leave and were forced to find a new space.',
          }],
        },
        {
          _type: 'block', _key: 'n-3', style: 'normal', markDefs: [],
          children: [{ _type: 'span', _key: 'n-3s', marks: [],
            text: 'The Joseph Center split its services to a building at the Salvation Army and another more active office at the Center for Independence. At first, we thought this was a setback however it opened the door for us to serve more people and expand our services and programs. The organization thrived in these new locations for about a year although there were some logistical challenges. That fall, we were once again told that the day shelter program would have to move. Winter was coming. We were donated a large warehouse space with the intention of merging all of our services together under one roof.',
          }],
        },
        {
          _type: 'block', _key: 'n-4', style: 'normal', markDefs: [],
          children: [{ _type: 'span', _key: 'n-4s', marks: [],
            text: 'A generous donation was given to the Joseph Center to purchase a new building. Early 2019, the Joseph Center had a new home and renovations on the building began. The Joseph Center now operates a day shelter as well as the Joseph Center Adult Advocacy Program (JCAAP) and Generating Our Resources (GOR) through our fundraising events. The GOR program changed into Integrated Financial Services providing guardianship, conservatorship, VA fiduciary, and budget counseling.',
          }],
        },
        {
          _type: 'block', _key: 'n-5', style: 'normal', markDefs: [],
          children: [{ _type: 'span', _key: 'n-5s', marks: [],
            text: 'We always can use more support. Become a partner or volunteer to start building the community.',
          }],
        },
      ],
    },
    {
      _type: 'dualCtaSection',
      _key: 'ctas-our-story',
      buttons: [
        { _key: 'cta-partner', _type: 'ctaButton', label: 'Become a Partner', href: '/donate', variant: 'secondary' },
        { _key: 'cta-volunteer', _type: 'ctaButton', label: 'Find a Position That Fits Your Ability', href: '/forms/volunteer', variant: 'primary' },
      ],
    },
  ],
}

async function run() {
  console.log(`Overwriting page-our-story on dataset: ${dataset}`)
  await client.createOrReplace(pageOurStory)
  console.log('page-our-story updated. Hard-refresh /our-story to see new sections.')
}

run().catch((err) => {
  console.error('patch-our-story failed:', err.message)
  process.exit(1)
})
