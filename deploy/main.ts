import { config } from './config';
import { loadBundleJs } from './load-bundle-js';
import { getUserPageText } from './templates';
import { updateScrapboxPage } from './update-scrapbox-page';

(async () => {
  const userScriptPageText = getUserPageText(await loadBundleJs());

  await updateScrapboxPage({ url: config.userPageUrl, text: userScriptPageText });
})()
  .then(() => {
    console.log('deploy completed');
    process.exit();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
