import { testBrowserClipboardPermission } from './test-browser-clipboard-permission';

(async () => {
  await testBrowserClipboardPermission();
})()
  .then(() => {
    console.log('deploy completed');
    process.exit();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
