// load .env file for development in local
require('dotenv').config();

import * as path from 'path';

import { runDeployScript } from 'scrapbox-tools';

const getDistDirPath = (file: string) => path.join(process.cwd(), 'dist', file);

export const config = {
  deployTargets: [
    {
      userId: '5dc685a50fc39d0017e27558',
      projectId: '5dc685a50fc39d0017e27559',
      projectName: 'km-study',
      targetPageName: 'kou',
      codeBlockLabel: 'script.js',
      sourceFilePath: getDistDirPath('km-study.min.js'),
    },
    {
      userId: '5dc685a50fc39d0017e27558',
      projectId: '5dc685a50fc39d0017e27559',
      projectName: 'km-study',
      targetPageName: 'settings',
      codeBlockLabel: 'style.css',
      sourceFilePath: getDistDirPath('km-study.min.css'),
    },
  ],
};

runDeployScript(process.env.TOKEN || '', config.deployTargets).finally(() => {
  console.log('deploy completed');
});
