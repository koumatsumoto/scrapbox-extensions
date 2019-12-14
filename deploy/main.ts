import { config } from './config';
import { testBrowserCanPaste, updateScrapboxUserScript } from './update-scrapbox-user-script';

(async () => {
  await testBrowserCanPaste(config);
})()
  .then(() => {
    process.exit();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
