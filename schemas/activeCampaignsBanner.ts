import { defineType, defineField } from 'sanity';

// Renders any active org-wide campaigns (those without a program_id) using
// the CampaignProgressBar component. Section is invisible when no
// campaigns are active — safe to drop into a page and forget.
//
// Place wherever in a page's sections array. The section auto-fetches at
// runtime from Turso; no per-campaign config is needed here.
export default defineType({
  name: 'activeCampaignsBanner',
  title: 'Active Campaigns Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Optional heading above the campaign cards',
      type: 'string',
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }: { heading?: string }) => ({
      title: heading || 'Active Campaigns',
      subtitle: 'Pulls live from the donations DB — hidden when empty',
    }),
  },
});
