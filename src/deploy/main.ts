// load .env file for development in local
import { config } from './config';
import { deployByPrivateApi } from './deploy-by-private-api/deploy-by-private-api';
import { loadCSS, loadJS } from './loaders';
import { getSettingsPageText, getUserPageText } from './templates';

require('dotenv').config();

(async () => {
  const userPageText = getUserPageText(await loadJS());
  const settingsPageText = getSettingsPageText(await loadCSS());

  // deploy user script and user css
  await Promise.all([deployByPrivateApi({ url: config.userPageUrl, codeName: 'script.js', text: userPageText })]);
})()
  .then(() => {
    console.log('deploy completed');
    process.exit();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
