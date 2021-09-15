import { Router, ScrapboxApi } from 'scrapbox-tools';
import { documentReady } from './libs';
import { customPageStyle, DynamicConfig, episodeButton, listViewCustomization, replaceLinkToNewPage } from './scripts';

const main = () => {
  const scrapboxApi = new ScrapboxApi();
  const router = new Router();
  const dynamicConfig = new DynamicConfig(scrapboxApi);
  // for debug
  (window as any)['sx'] = { scrapboxApi, router, dynamicConfig };

  documentReady().subscribe(() => {
    replaceLinkToNewPage({ router });
    listViewCustomization({ scrapboxApi });
    episodeButton({ scrapboxApi, dynamicConfig });
    customPageStyle();
  });
};

main();
