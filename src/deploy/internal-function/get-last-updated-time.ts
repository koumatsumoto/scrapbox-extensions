import * as puppeteer from 'puppeteer';
import { WindowWithScrapbox } from '../../types/scrapbox';

export const getLastUpdatedTime = async (page: puppeteer.Page) =>
  page.evaluate(() => {
    return (window as WindowWithScrapbox).scrapbox.Page.lines.map((l) => l.updated).reduce((prev, curr) => (prev < curr ? curr : prev), 0);
  });
