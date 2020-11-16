import * as path from 'path';

const getDistDirPath = (file: string) => path.join(process.cwd(), 'dist', file);

export const config = {
  deployTargets: [
    {
      projectName: 'km-study',
      targetPageName: 'kou',
      codeBlockLabel: 'script.js',
      sourceFilePath: getDistDirPath('km-study.min.js'),
    },
    {
      projectName: 'km-study',
      targetPageName: 'settings',
      codeBlockLabel: 'style.css',
      sourceFilePath: getDistDirPath('km-study.min.css'),
    },
  ],
};
