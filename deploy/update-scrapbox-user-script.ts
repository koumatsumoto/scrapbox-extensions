import * as puppeteer from 'puppeteer';
import { Config } from './config';
import { getWholePageText } from './user-page-template';
import { debugClipboard, setClipboardValue } from './util';

const chromeUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36';
const newText = getWholePageText('script');

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
