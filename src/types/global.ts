import { Scrapbox } from './scrapbox';

// FIXME: deprecated, use getter function getScrapbox
declare global {
  interface Window {
    scrapbox: Scrapbox;
  }
}
