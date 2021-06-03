// webpack use this file as entry file to build
import { documentReady } from './libs';
import { defaultDiaryPage, episodeButton, listViewCustomization, loggedInCss, setupDynamicConfig, memolia } from './scripts';

const main = () => {
  documentReady().subscribe(() => {
    setupDynamicConfig();
    listViewCustomization();
    loggedInCss();
    defaultDiaryPage();
    episodeButton();
    memolia();
  });
};

main();
