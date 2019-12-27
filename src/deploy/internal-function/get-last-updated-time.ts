import * as puppeteer from 'puppeteer';
import '../../types/scrapbox';

export const getLastUpdatedTime = async (page: puppeteer.Page) =>
  page.evaluate(() => {
    return window.scrapbox.Page.lines.map((l) => l.updated).reduce((prev, curr) => (prev < curr ? curr : prev), 0);
  });
