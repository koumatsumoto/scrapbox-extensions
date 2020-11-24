// NOTE: webpack use this file as entry file to build

/**
 * Common variables and functions (Scrapbox loads each scripts into global environment)
 */
import { runOnScrapboxReady } from './libs/scrapbox/browser-api';
import {
  defaultDiaryPage,
  episodeButton,
  listViewCustomization,
  loggedInCss,
  setupDynamicConfig,
  setupGlobalHelpers,
  memolia,
} from './scripts';

const main = () => {
  runOnScrapboxReady(async () => {
    setupGlobalHelpers();
    setupDynamicConfig();
    listViewCustomization();
    loggedInCss();
    defaultDiaryPage();
    episodeButton();
    memolia();
  });
};

main();
