import { WindowWithScrapbox } from '../../types/scrapbox';

export const getScrapbox = () => (window as WindowWithScrapbox).scrapbox;
