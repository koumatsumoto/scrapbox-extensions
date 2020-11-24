/**
 * Common variables and functions (Scrapbox loads each scripts into global environment)
 */
import { runOnScrapboxReady } from './libs/scrapbox/browser-api';
import {
  applyLoginCSSClass,
  defaultDiaryPage,
  enableCustomListItem,
  getDynamicConfig,
  setupGlobalHelpers,
  useAddEpisodeButton,
  useMemolia,
  useVersionNotificator,
} from './scripts';

const main = () => {
  runOnScrapboxReady(async () => {
    setupGlobalHelpers();

    enableCustomListItem();

    // add custom css class to body tag
    applyLoginCSSClass();

    // since 2020/04/20
    useAddEpisodeButton();
    // since 2020/04/20
    useMemolia();
    // since 2020/04/27
    useVersionNotificator();
    // since 2020-04-28
    getDynamicConfig().catch();
    // since 2020-11-09
    defaultDiaryPage();
  });
};

main();
