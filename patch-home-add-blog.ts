// One-shot: insert a latestBlogSection into the home page sections list on
// STAGING. Idempotent — bails if a latestBlogSection is already present.
//
//   SANITY_STUDIO_DATASET=staging pnpm sanity exec ./patch-home-add-blog.ts --with-user-token

import { getCliClient } from 'sanity/cli';

const client = getCliClient();

type Section = { _type: string; _key?: string };
type Page = { _id: string; _rev?: string; sections?: Section[] };

const NEW_SECTION: Section = {
  _type: 'latestBlogSection',
  _key: 'home-latest-blog',
  // Field values intentionally omitted — schema defaults handle:
  //   heading = "Latest from the Blog"
  //   subtext = (empty, falls back to component default)
  //   postCount = 3
  //   ctaLabel = "Read All Posts →"
};

async function run() {
  const ds = (client.config() as { dataset?: string }).dataset ?? '(unknown)';
  if (ds !== 'staging') {
    console.error(`Refusing to patch: dataset=${ds}. Run with SANITY_STUDIO_DATASET=staging.`);
    process.exit(1);
  }

  const page = await client.fetch<Page | null>(
    '*[_type == "page" && slug.current == "/"][0]'
  );
  if (!page) { console.error('Home page not found.'); process.exit(1); }

  const sections = page.sections ?? [];
  if (sections.some((s) => s._type === 'latestBlogSection')) {
    console.log('Home already has latestBlogSection — no-op.');
    return;
  }

  // Insert just before partnersSection if present (the "partners" band reads
  // as the closing band of the home page); otherwise append at the end.
  const partnersIdx = sections.findIndex((s) => s._type === 'partnersSection');
  const next = partnersIdx >= 0
    ? [...sections.slice(0, partnersIdx), NEW_SECTION, ...sections.slice(partnersIdx)]
    : [...sections, NEW_SECTION];

  await client
    .patch(page._id)
    .set({ sections: next })
    .commit({ autoGenerateArrayKeys: true });

  await client.delete('drafts.' + page._id).catch(() => {});
  console.log(`Inserted latestBlogSection on home (position ${partnersIdx >= 0 ? partnersIdx : next.length - 1}).`);
}

run().catch((err: Error) => {
  console.error(err.message);
  process.exit(1);
});
