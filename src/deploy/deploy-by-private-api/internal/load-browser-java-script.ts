import '../../browser-script/global-type';
import * as puppeteer from 'puppeteer';
import { loadBrowserScript } from '../../loaders';

export const loadBrowserJavaScript = async (page: puppeteer.Page) => {
  const contents = await loadBrowserScript();
  page.evaluate((sourceCode) => {
    eval(sourceCode);

    return window.waitForMyScriptsReady();
  }, contents);
};
