import * as puppeteer from 'puppeteer';
import { getPageLastUpdatedTime } from '../../libs/scrapbox';

export const getLastUpdatedTime = async (page: puppeteer.Page) => page.evaluate(() => getPageLastUpdatedTime());
