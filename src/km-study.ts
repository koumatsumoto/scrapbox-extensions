import { forkJoin } from 'rxjs';
import { DynamicConfig, Router, ScrapboxApi } from 'scrapbox-tools';
import { addContentsButton, customListStyle, customPageStyle, replaceLinkToNewPage } from './scripts';

const main = () => {
  const scrapboxApi = new ScrapboxApi();
  const router = new Router();
  const dynamicConfig = new DynamicConfig(scrapboxApi);
  // for debug
  (window as any)['sx'] = { scrapboxApi, router, dynamicConfig };

  forkJoin([router.documentReady, dynamicConfig.data]).subscribe(([, config]) => {
    customListStyle({ scrapboxApi, config });
    customPageStyle();
    addContentsButton({ scrapboxApi, config });
    replaceLinkToNewPage({ router });
  });
};

main();
