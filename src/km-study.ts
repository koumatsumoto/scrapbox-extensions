// webpack use this file as entry file to build
import { documentReady } from './libs';
import { replaceLinkToNewPage, episodeButton, listViewCustomization, loggedInCss, memolia } from './scripts';

const main = () => {
  documentReady().subscribe(() => {
    replaceLinkToNewPage();
    listViewCustomization();
    loggedInCss();
    episodeButton();
    memolia();
  });
};

main();
