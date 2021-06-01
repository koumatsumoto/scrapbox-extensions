// NOTE: webpack use this file as entry file to build

/**
 * Common variables and functions (Scrapbox loads each scripts into global environment)
 */
import { scrapboxReady } from './libs/scrapbox/browser-api/scrapbox';
import { defaultDiaryPage, episodeButton, listViewCustomization, loggedInCss, setupDynamicConfig, memolia } from './scripts';

const main = () => {
  scrapboxReady().subscribe(() => {
    setupDynamicConfig();
    listViewCustomization();
    loggedInCss();
    defaultDiaryPage();
    episodeButton();
    memolia();
  });
};

main();
