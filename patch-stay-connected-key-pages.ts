// One-shot: insert stayConnectedSection on key staging pages (home,
// our-story, programs). Idempotent — bails per-page if already present.
// Refuses to run against any dataset other than staging.
//
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec ./patch-stay-connected-key-pages.ts --with-user-token

import { getCliClient } from 'sanity/cli';

const client = getCliClient();

type Section = { _type: string; _key?: string };
type Page = { _id: string; sections?: Section[] };

// Per-page placement: where to insert the band. We anchor to a specific
// section type already on the page so the band lands somewhere sensible
// (typically near the bottom, before the partners/cta band). Falls back
// to appending at the end if the anchor isn't found.
const TARGETS: { slug: string; key: string; anchorBefore: string }[] = [
  // Home: before the partnersSection (which is the closing band).
  { slug: '/',          key: 'home-stay-connected',         anchorBefore: 'partnersSection' },
  // Our Story: before the dualCtaSection (the closing CTA pair).
  { slug: '/our-story', key: 'our-story-stay-connected',    anchorBefore: 'dualCtaSection' },
  // Programs index: just append — that page only has three sections today,
  // so end-of-page is the right spot.
  { slug: '/programs',  key: 'programs-stay-connected',     anchorBefore: '' },
];

async function patchPage(target: { slug: string; key: string; anchorBefore: string }) {
  const page = await client.fetch<Page | null>(
    '*[_type == "page" && slug.current == $slug][0]',
    { slug: target.slug }
  );
  if (!page) {
    console.warn(`skip   ${target.slug} — not found`);
    return;
  }
  const sections = page.sections ?? [];
  if (sections.some((s) => s._type === 'stayConnectedSection')) {
    console.log(`exists ${target.slug}`);
    return;
  }

  const newSection: Section = {
    _type: 'stayConnectedSection',
    _key: target.key,
  };

  let next: Section[];
  if (target.anchorBefore) {
    const idx = sections.findIndex((s) => s._type === target.anchorBefore);
    next = idx >= 0
      ? [...sections.slice(0, idx), newSection, ...sections.slice(idx)]
      : [...sections, newSection];
  } else {
    next = [...sections, newSection];
  }

  await client
    .patch(page._id)
    .set({ sections: next })
    .commit({ autoGenerateArrayKeys: true });
  await client.delete('drafts.' + page._id).catch(() => {});
  console.log(`add    ${target.slug}`);
}

async function run() {
  const ds = (client.config() as { dataset?: string }).dataset ?? '(unknown)';
  if (ds !== 'staging') {
    console.error(`Refusing to patch: dataset=${ds}. Run with SANITY_STUDIO_DATASET=staging.`);
    process.exit(1);
  }
  for (const t of TARGETS) {
    await patchPage(t);
  }
}

run().catch((err: Error) => {
  console.error(err.message);
  process.exit(1);
});
