import { userPageTemplate } from './user-page-template';

export const origin = 'https://scrapbox.io';
const project = 'km-study-records';
const user = 'kou';
const token = 's%3AJCDs1A5gs-jJqeOP3RPjqEWi3dvbYrfE.Z7GkuuesS%2FgsuAfP9eXgKPn8FO32i6XUYJg4byRnIPE';

export const config = {
  browserWindowWidth: 800,
  browserWindowHeight: 600,
  browserUserAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36',
  userPageUrl: `${origin}/${project}/${user}`,
  origin,
  cookieToAuth: {
    /** The cookie name. */
    name: 'connect.sid',
    /** The cookie value. */
    value: token,
    /** The cookie domain. */
    domain: 'scrapbox.io',
    /** The cookie path. */
    path: '/',
    /** The cookie http only flag. */
    httpOnly: true,
    /** The session cookie flag. */
    session: false,
    /** The cookie secure flag. */
    secure: true,
  },
  userPageTemplate,
  // selectorToUserScriptText: '.app .page .lines .line .code-body .hljs-keyword span',
  selectorToUserScriptText: '.app .page .lines .line .text > span',
} as const;

export type Config = typeof config;
