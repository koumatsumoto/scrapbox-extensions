// load .env file for development in local
require('dotenv').config();

import * as path from 'path';

import { Deployer } from 'scrapbox-tools';

const getDistDirPath = (file: string) => path.join(process.cwd(), 'dist', file);

export const config = {
  deployTargets: [
    {
      targetPageName: 'kou',
      codeBlockLabel: 'script.js',
      sourceFilePath: getDistDirPath('km-study.min.js'),
    },
    {
      targetPageName: 'settings',
      codeBlockLabel: 'style.css',
      sourceFilePath: getDistDirPath('km-study.min.css'),
    },
  ],
};

const main = async () => {
  const deployer = new Deployer('km-study', process.env.TOKEN);
  const deployTasks = config.deployTargets.map((data) => deployer.deploy(data));

  return Promise.all(deployTasks);
};

main()
  .then(() => {
    console.log('deploy completed');
    process.exit(0);
  })
  .catch((e) => {
    console.error('deploy errored', e);
    process.exit(1);
  });
