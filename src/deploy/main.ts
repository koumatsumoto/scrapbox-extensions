// load .env file for development in local
require('dotenv').config();

import { runDeployScript } from 'scrapbox-tools';
import { config } from './config';

runDeployScript(process.env.TOKEN || '', config.deployTargets).finally(() => {
  console.log('deploy completed');
});
