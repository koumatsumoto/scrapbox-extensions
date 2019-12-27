import { Scrapbox } from '../../types/scrapbox';

type WindowWithScrapbox = Window & {
  scrapbox: Scrapbox;
};

export const getScrapbox = () => (window as WindowWithScrapbox).scrapbox;
