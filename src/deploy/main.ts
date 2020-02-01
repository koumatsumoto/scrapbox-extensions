// load .env file for development in local
require('dotenv').config();

import * as puppeteer from 'puppeteer';
import { config } from './config';
import { deployCssAndScriptForProject } from './deploy-by-private-api/deploy-by-private-api';

(async () => {
  const browser = await puppeteer.launch({ headless: !config.local });

  // deploy user script and user css for each project
  await Promise.all(config.projects.map((settings) => deployCssAndScriptForProject(browser, settings)));

  await browser.close();
})()
  .then(() => {
    console.log('deploy completed');
    process.exit();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
