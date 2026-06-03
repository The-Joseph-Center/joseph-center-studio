import page from './page';
import siteSettings from './siteSettings';
import navigation from './navigation';
import footerColumns from './footerColumns';
import socialLinks from './socialLinks';
import testimonialVideo from './testimonialVideo';
import post from './post';
import annualReport from './annualReport';
import coffeeEpisode from './coffeeEpisode';
import event from './event';
import program from './program';
import programDonationsSection from './programDonationsSection';
import programResourcesSection from './programResourcesSection';
import howYouCanHelp from './howYouCanHelp';
import videoSection from './videoSection';
import dualCtaSection from './dualCtaSection';
import diagonalTextSection from './diagonalTextSection';
import staff from './staff';
import board from './board';
import peopleGrid from './peopleGrid';
import videoGridSection from './videoGridSection';
import eventsListSection from './eventsListSection';
import transparencySection from './transparencySection';
import podcastEpisodesSection from './podcastEpisodesSection';
import partnershipSection from './partnershipSection';
import oneTimeGiftSection from './oneTimeGiftSection';
import banner from './banner';
import dynamicForm from './dynamicForm';
import stayConnectedSection from './stayConnectedSection';
import latestCoffeeChatSection from './latestCoffeeChatSection';

export const schemaTypes = [
  page,
  siteSettings,
  navigation,
  footerColumns,
  socialLinks,
  testimonialVideo,
  post,
  annualReport,
  coffeeEpisode,
  event,
  program,
  // howYouCanHelp is used as a section inside page.ts but exporting it here
  // is required so Sanity registers the object schema.
  howYouCanHelp,
  programDonationsSection,
  programResourcesSection,
  videoSection,
  dualCtaSection,
  diagonalTextSection,
  staff,
  board,
  peopleGrid,
  videoGridSection,
  eventsListSection,
  transparencySection,
  podcastEpisodesSection,
  partnershipSection,
  oneTimeGiftSection,
  banner,
  dynamicForm,
  stayConnectedSection,
  latestCoffeeChatSection,
];
