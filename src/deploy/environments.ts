type AllowedEnv = {
  // scrapbox project name
  PROJECT?: string;
  // scrapbox user name
  USER?: string;
  // value of cookie authentication
  TOKEN?: string;
};

const isValid = (val: any): val is string => typeof val === 'string' && 0 < val.length;

export const getEnv = () => {
  const env = process.env as AllowedEnv;

  if (!isValid(env.PROJECT)) {
    throw new Error('process.env.PROJECT is invalid');
  }
  if (!isValid(env.USER)) {
    throw new Error('process.env.USER is invalid');
  }
  if (!isValid(env.TOKEN)) {
    throw new Error('process.env.TOKEN is invalid');
  }

  return {
    project: env.PROJECT,
    user: env.USER,
    token: env.TOKEN,
  };
};
