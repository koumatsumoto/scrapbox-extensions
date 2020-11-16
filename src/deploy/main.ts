// load .env file for development in local
require('dotenv').config();

import { deploy } from 'scrapbox-tools';
import { config } from './config';

// value of auth cookie
export const isValidToken = (val: unknown): val is string => typeof val === 'string' && 0 < val.length;
export const getValidEnv = (env: typeof process.env) => {
  if (!isValidToken(env.TOKEN)) {
    throw new Error('process.env.TOKEN is invalid');
  }

  return {
    token: env.TOKEN,
  } as const;
};

export const main = async () => {
  const env = getValidEnv(process.env);
  const deployTasks = config.deployTargets.map((data) =>
    deploy({
      ...data,
      token: env.token,
    }),
  );

  await Promise.all(deployTasks);
};

main()
  .then(() => {
    console.log('[sx/deploy] completed');
    process.exit();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
