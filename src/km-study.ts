// webpack use this file as entry file to build
import { documentReady } from './libs';
import { customPageStyle, episodeButton, listViewCustomization, loggedInCss, replaceLinkToNewPage } from './scripts';

const main = () => {
  documentReady().subscribe(() => {
    replaceLinkToNewPage();
    listViewCustomization();
    loggedInCss();
    episodeButton();
    customPageStyle();
  });
};

main();
