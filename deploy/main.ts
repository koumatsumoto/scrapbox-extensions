import { config } from './config';
import { testBrowserCanPaste, updateScrapboxUserScript } from './test-browser-clipboard-permission';

(async () => {
  await testBrowserCanPaste(config);
})()
  .then(() => {
    console.log('deploy completed');
    process.exit();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
