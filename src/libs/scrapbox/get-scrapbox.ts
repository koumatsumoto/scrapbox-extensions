import { Scrapbox } from '../../types/scrapbox';

declare global {
  interface Window {
    scrapbox: Scrapbox;
  }
}

export const getScrapbox = () => window.scrapbox;
