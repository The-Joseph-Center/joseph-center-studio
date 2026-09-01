import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  deployment: {
    // The hosted Studio at jc-studio.sanity.studio. Without this, `sanity deploy`
    // prompts for the application every time, and picking the wrong one would
    // publish over a different studio.
    appId: 'hcclfm78bw73isb893ao27ya',
  },
});
