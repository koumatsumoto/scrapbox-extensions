import * as assert from 'assert';
import { Browser, BrowserContext } from 'puppeteer';
import * as puppeteer from 'puppeteer';
import { config, Config } from './config';
import { getWholePageText } from './user-page-template';

const chromeUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36';
const newText = getWholePageText('script');

const getFullPermissionBrowserContext = async (browser: Browser, origin: string) => {
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(origin, [
    'geolocation',
    'midi',
    'midi-sysex',
    'notifications',
    'camera',
    'microphone',
    'background-sync',
    'ambient-light-sensor',
    'accelerometer',
    'gyroscope',
    'magnetometer',
    'accessibility-events',
    'clipboard-read',
    'clipboard-write',
    'payment-handler',
  ]);

  return context;
};

const getConfiguredPage = async (context: BrowserContext) => {
  const page = await context.newPage();
  await page.setViewport({
    width: config.browserWindowWidth,
    height: config.browserWindowHeight,
    deviceScaleFactor: 1,
  });
  await page.setUserAgent(config.browserUserAgent);
  await page.setCookie(config.cookieToAuth);

  return page;
};

const setClipboardValue = (page: puppeteer.Page, value: string) => page.evaluate((text) => navigator.clipboard.writeText(text), value);

const findOrFail = async (page: puppeteer.Page, selector: string) => {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`"${selector}" not found, check latest dom and element in scrapbox.io`);
  }

  return element;
};

const tryInputAction = async (page: puppeteer.Page, action: () => Promise<any>) => {
  await page.waitFor(1000);
  await action();
  await page.waitFor(1000);
};

const getConfiguredBrowser = () =>
  puppeteer.launch({ headless: false, args: [`--window-size=${config.browserWindowWidth},${config.browserWindowHeight}`] });

export const testBrowserCanPaste = async (config?: Config) => {
  const url = 'https://www.google.co.jp';
  const inputElementSelector = 'input[type=text]';
  const clipboardValue = 'value for clipboard!';
  const browser = await getConfiguredBrowser();
  const context = await getFullPermissionBrowserContext(browser, url);
  const page = await getConfiguredPage(context);

  await page.goto(url);
  await page.waitFor(3000);

  const input = await findOrFail(page, inputElementSelector);

  // setup clipboard
  await input.click();
  await setClipboardValue(page, clipboardValue);

  // paste by Ctrl+v
  await tryInputAction(page, () => Promise.all([input.press('Control'), input.press('v')]));

  // assert value is pasted
  const v = await page.$eval(inputElementSelector, (e) => (e as HTMLInputElement).value);
  assert.equal(v, clipboardValue);

  await browser.close();
};

const debugClipboard = (page: puppeteer.Page) =>
  page.evaluate(() => {
    navigator.clipboard.readText().then((v) => alert(v));
  });

export const updateScrapboxUserScript = async (config: Config) => {
  const width = 800;
  const height = 600;
  const textareaSelector = '#text-input';
  const browser = await puppeteer.launch({ headless: false, args: [`--window-size=${width},${height}`] });
  const fail = async (error: any) => {
    console.error(error);
    await browser.close();
    process.exit(1);
  };

  const context = browser.defaultBrowserContext();
  await context.clearPermissionOverrides();
  await context.overridePermissions(config.userPageUrl, ['clipboard-read', 'clipboard-write']);

  const page = await context.newPage();
  await page.setViewport({
    width,
    height,
    deviceScaleFactor: 1,
  });
  await page.setUserAgent(chromeUserAgent);
  await page.setCookie(config.cookieToAuth);

  await page.goto(config.userPageUrl);
  // wait for react bootstrapping
  await page.waitFor(5000);

  const selectElement = async (selector: string) => {
    const element = await page.$(selector);
    if (!element) {
      throw new Error(`"${selector}" not found, check latest dom and element in scrapbox.io`);
    }

    return element;
  };

  // delete all existent text
  const deleteAllText = async () => {
    const textareaElement = await selectElement(textareaSelector);
    await textareaElement.click();
    await Promise.all([textareaElement.press('Control'), textareaElement.press('a')]);
    await Promise.all([textareaElement.press('Control'), textareaElement.press('c')]);
    await textareaElement.press('Delete');

    await Promise.all([textareaElement.press('Control'), textareaElement.press('v')]);
  };

  await debugClipboard(page);

  // paste
  const pasteText = async () => {
    const textHead = await selectElement(config.selectorToUserScriptText);
    await textHead.click();
    const textareaElement = await selectElement(textareaSelector);
    await textareaElement.click();
    await page.waitFor(300);
    await setClipboardValue(page, newText).catch((e) => fail(e));
    await Promise.all([textareaElement.press('Control'), textareaElement.press('v')]);
  };

  await deleteAllText();
  await page.waitFor(1000);
  await pasteText();
  await page.waitFor(1000 * 3);

  const textHead = await selectElement(config.selectorToUserScriptText);
  await textHead.click();
  await page.waitFor(500);
  await textHead.type(newText, { delay: 30 });

  const textareaElement = await selectElement(textareaSelector);
  await textareaElement.click();

  const e = await selectElement('.code-body');
  await e.click({ clickCount: 3 });
  await page.waitFor(500);
  await page.keyboard.press('Space');
  await page.keyboard.press('a');

  await Promise.all([textareaElement.press('Control'), textareaElement.press('a')]);
  await page.keyboard.down('Control');
  await page.waitFor(30);
  await textareaElement.press('V');
  await page.waitFor(100);
  await page.keyboard.up('Control');
  await page.waitFor(30);

  await Promise.all([textareaElement.press('Control'), textareaElement.press('v')]);

  await page.waitFor(1000 * 3);

  await browser.close();
};
