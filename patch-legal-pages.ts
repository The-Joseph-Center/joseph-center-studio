// One-off script — seeds canonical content into the four legal pages from
// 19-legal-pages.md. Existing staging shells (legal-privacy-policy,
// legal-terms-and-conditions, legal-accessibility) are overwritten; the
// missing legal-cookie-policy is created.
//
// Run: SANITY_STUDIO_DATASET=staging pnpm sanity exec patch-legal-pages.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const dataset = client.config().dataset

if (dataset === 'production' && process.env.CONFIRM_PRODUCTION !== 'yes') {
  console.error(
    'Refusing to overwrite legal pages on production.\n' +
      'If you really mean to do this, re-run with:\n' +
      '  CONFIRM_PRODUCTION=yes SANITY_STUDIO_DATASET=production pnpm sanity exec patch-legal-pages.ts --with-user-token'
  )
  process.exit(1)
}

// ─── Portable text helpers ──────────────────────────────────────────────────
let keyCounter = 0
const nextKey = (prefix = 'k') => `${prefix}-${(++keyCounter).toString(36)}`

interface Block {
  _type: 'block'
  _key: string
  style: 'normal' | 'h2' | 'h3'
  markDefs: never[]
  listItem?: 'bullet'
  level?: number
  children: Array<{ _type: 'span'; _key: string; text: string; marks: string[] }>
}

function span(text: string): { _type: 'span'; _key: string; text: string; marks: string[] } {
  return { _type: 'span', _key: nextKey('s'), text, marks: [] }
}

function p(text: string): Block {
  return {
    _type: 'block',
    _key: nextKey('b'),
    style: 'normal',
    markDefs: [],
    children: [span(text)],
  }
}

function h2(text: string): Block {
  return {
    _type: 'block',
    _key: nextKey('b'),
    style: 'h2',
    markDefs: [],
    children: [span(text)],
  }
}

function li(text: string): Block {
  return {
    _type: 'block',
    _key: nextKey('b'),
    style: 'normal',
    markDefs: [],
    listItem: 'bullet',
    level: 1,
    children: [span(text)],
  }
}

const CONTACT_BLOCK: Block[] = [
  h2('Contact Us'),
  p('The Joseph Center'),
  p('2511 Belford Ave Ste B'),
  p('Grand Junction, CO 81501'),
  p('(970) 245-7672'),
]

const LAST_UPDATED = '2026-05-20'

// ─── Privacy Policy ─────────────────────────────────────────────────────────
function buildPrivacyPolicy() {
  keyCounter = 0
  return {
    _type: 'legalPage',
    _id: 'legal-privacy-policy',
    title: 'Privacy Policy',
    slug: { _type: 'slug', current: '/privacy-policy' },
    lastUpdated: LAST_UPDATED,
    body: [
      p('The Joseph Center ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you visit josephcentergj.com or interact with our programs.'),

      h2('Information We Collect'),
      p('We collect information you voluntarily provide when you:'),
      li('Submit a volunteer application (name, contact details, availability, employment history)'),
      li('Submit a program referral form (referrer and individual contact details)'),
      li('Contact us through our website contact form'),
      li('Sign up for our newsletter or email updates'),
      p('We do not collect sensitive personal information such as Social Security numbers, financial account details, or medical records through this website.'),

      h2('How We Use Your Information'),
      p('We use the information we collect to:'),
      li('Process volunteer applications and coordinate scheduling'),
      li('Connect referred individuals with the appropriate Joseph Center programs'),
      li('Respond to your inquiries and support requests'),
      li('Send program updates and newsletters (with your consent)'),
      li('Improve our website and services'),

      h2('Data Storage'),
      p('Form submissions are stored securely in our database. We retain this information for as long as necessary to fulfill the purposes described in this policy or as required by law.'),

      h2('Email Communications'),
      p('If you sign up for our newsletter or updates, we use AWeber to manage our email list. You may unsubscribe at any time by clicking the unsubscribe link in any email or by contacting us directly.'),

      h2('Analytics'),
      p('We use analytics tools to understand how visitors use our website. This data is aggregated and anonymized — we do not track individual users for advertising purposes.'),

      h2('Cookies'),
      p('We use a limited number of cookies necessary for website functionality and analytics. We do not use cookies for advertising or to track you across other websites. See our Cookie Policy for details.'),

      h2('Third-Party Services'),
      p('We use trusted third-party services to operate our website and programs. These services have their own privacy policies governing use of your information.'),

      h2("Children's Privacy"),
      p('Our website is not directed to children under 13. We do not knowingly collect personal information from children under 13.'),

      h2('Your Rights'),
      p('You may request access to, correction of, or deletion of your personal information by contacting us at the information below. We will respond to reasonable requests within 30 days.'),

      h2('Changes to This Policy'),
      p('We may update this Privacy Policy periodically. We will post any changes on this page with an updated effective date.'),

      ...CONTACT_BLOCK,
    ],
  }
}

// ─── Terms & Conditions ─────────────────────────────────────────────────────
function buildTermsConditions() {
  keyCounter = 0
  return {
    _type: 'legalPage',
    _id: 'legal-terms-and-conditions',
    title: 'Terms & Conditions',
    slug: { _type: 'slug', current: '/terms-and-conditions' },
    lastUpdated: LAST_UPDATED,
    body: [
      p('By accessing and using josephcentergj.com (the "Site"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use this Site.'),

      h2('Use of This Site'),
      p('This Site is provided by The Joseph Center for informational purposes and to facilitate community engagement. You agree to use this Site only for lawful purposes and in a manner that does not infringe the rights of others.'),
      p('You agree not to:'),
      li('Use the Site in any way that could damage, disable, or impair its functionality'),
      li('Attempt to gain unauthorized access to any part of the Site'),
      li('Submit false, misleading, or fraudulent information through any form on this Site'),
      li('Use the Site to harass, harm, or discriminate against any person or group'),

      h2('Volunteer Applications and Forms'),
      p("Information submitted through our volunteer application and referral forms is used solely for The Joseph Center's program operations. Submitting an application does not guarantee placement as a volunteer or guarantee program services."),

      h2('Donations'),
      p('Donations made through this Site or linked platforms are processed by third-party payment providers. All donations to The Joseph Center are used to support our mission of serving people experiencing homelessness and poverty in Grand Junction, Colorado. The Joseph Center is a nonprofit organization — please consult a tax advisor regarding the deductibility of your contribution.'),

      h2('Intellectual Property'),
      p('All content on this Site, including text, images, logos, and graphics, is the property of The Joseph Center or its content providers and is protected by applicable copyright and trademark law. You may not reproduce, distribute, or create derivative works without our written permission.'),

      h2('Disclaimer of Warranties'),
      p('This Site is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the Site will be error-free or uninterrupted.'),

      h2('Limitation of Liability'),
      p('To the fullest extent permitted by law, The Joseph Center shall not be liable for any indirect, incidental, or consequential damages arising from your use of this Site.'),

      h2('External Links'),
      p('This Site may contain links to third-party websites. We are not responsible for the content or privacy practices of those sites.'),

      h2('Governing Law'),
      p('These Terms are governed by the laws of the State of Colorado, without regard to its conflict of law provisions.'),

      h2('Changes to These Terms'),
      p('We reserve the right to update these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance of the updated Terms.'),

      ...CONTACT_BLOCK,
    ],
  }
}

// ─── Accessibility Statement ────────────────────────────────────────────────
function buildAccessibility() {
  keyCounter = 0
  return {
    _type: 'legalPage',
    _id: 'legal-accessibility',
    title: 'Accessibility Statement',
    slug: { _type: 'slug', current: '/accessibility' },
    lastUpdated: LAST_UPDATED,
    body: [
      p('The Joseph Center is committed to ensuring that josephcentergj.com is accessible to people with disabilities. We strive to meet or exceed the requirements of the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.'),

      h2('Our Commitment'),
      p('We believe everyone deserves equal access to information about our programs and services. We are continually working to improve the accessibility of our website and welcome feedback on how we can do better.'),

      h2('Measures We Take'),
      p('We work to make our website accessible by:'),
      li('Providing text alternatives for non-text content (alt text for images)'),
      li('Ensuring sufficient color contrast between text and backgrounds'),
      li('Making all functionality available from a keyboard'),
      li('Providing visible focus indicators for interactive elements'),
      li('Ensuring all form fields have associated labels'),
      li('Supporting screen readers and other assistive technologies'),
      li('Designing for compatibility with common browsers and devices'),

      h2('Known Limitations'),
      p('Some content on this site may not yet fully meet accessibility standards, including:'),
      li('Some older PDF documents may not be fully accessible. We are working to remediate these.'),
      li('Some video content may not yet have captions. We are working to add captions to our video library.'),

      h2('Feedback and Contact'),
      p('We welcome feedback on the accessibility of josephcentergj.com. If you experience barriers accessing any content or functionality, or if you need information in an alternative format, please contact us:'),
      p('The Joseph Center'),
      p('2511 Belford Ave Ste B'),
      p('Grand Junction, CO 81501'),
      p('(970) 245-7672'),
      p('We aim to respond to accessibility feedback within 5 business days.'),

      h2('Technical Approach'),
      p('This website is built using semantic HTML, with ARIA landmarks and labels where appropriate. We test our pages with keyboard navigation and screen reader software as part of our development process.'),
    ],
  }
}

// ─── Cookie Policy ──────────────────────────────────────────────────────────
function buildCookiePolicy() {
  keyCounter = 0
  return {
    _type: 'legalPage',
    _id: 'legal-cookie-policy',
    title: 'Cookie Policy',
    slug: { _type: 'slug', current: '/cookie-policy' },
    lastUpdated: LAST_UPDATED,
    body: [
      p('This Cookie Policy explains how josephcentergj.com uses cookies and similar technologies.'),

      h2('What Are Cookies'),
      p('Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to site owners.'),

      h2('How We Use Cookies'),
      p('We use a minimal number of cookies on this Site:'),

      h2('Essential Cookies'),
      p('These cookies are necessary for the website to function. They enable core features such as page navigation and access to secure areas of the Site. The Site cannot function properly without these cookies.'),

      h2('Analytics Cookies'),
      p('We use analytics cookies to understand how visitors interact with our website — for example, which pages are visited most often and how visitors move through the Site. This helps us improve the user experience. This data is collected in aggregate and is not used to identify individual visitors.'),

      h2('What We Do Not Use'),
      p('We do not use:'),
      li('Advertising or tracking cookies'),
      li('Social media cookies that track you across other websites'),
      li('Cookies that share your data with third parties for marketing purposes'),

      h2('Managing Cookies'),
      p('You can control and manage cookies through your browser settings. Please note that disabling cookies may affect the functionality of this website.'),
      p('Most browsers allow you to:'),
      li('View what cookies are stored and delete them'),
      li('Block third-party cookies'),
      li('Block cookies from particular websites'),
      li('Block all cookies'),
      p("For more information about managing cookies, visit your browser's help documentation."),

      h2('Changes to This Policy'),
      p('We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated effective date.'),

      ...CONTACT_BLOCK,
    ],
  }
}

async function run() {
  console.log(`Patching 4 legal pages on dataset: ${dataset}`)
  const tx = client.transaction()
  tx.createOrReplace(buildPrivacyPolicy())
  tx.createOrReplace(buildTermsConditions())
  tx.createOrReplace(buildAccessibility())
  tx.createOrReplace(buildCookiePolicy())
  await tx.commit()
  console.log(
    'Pages updated: /privacy-policy, /terms-and-conditions, /accessibility, /cookie-policy'
  )
}

run().catch((err) => {
  console.error('patch-legal-pages failed:', err.message)
  process.exit(1)
})
