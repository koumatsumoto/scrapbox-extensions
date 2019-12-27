import * as puppeteer from 'puppeteer';
import { getLastUpdatedTime } from './get-last-update-time';
import addMinutes from 'date-fns/addMinutes';
import isAfter from 'date-fns/isAfter';

export const isPageUpdatedWithinOneMinute = async (page: puppeteer.Page) => {
  const lastUpdatedTime = new Date(await getLastUpdatedTime(page));
  const oneMinuteAgo = addMinutes(new Date(), -1);

  return isAfter(oneMinuteAgo, lastUpdatedTime);
};
