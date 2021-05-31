import { fromPredicate } from 'fp-ts/Option';
import { Page, RawScrapbox } from '../../types';

export const isPage = (page: RawScrapbox['Page']): page is Page => !!page.title;
export const getPage = (w = window) => fromPredicate(isPage)(w.scrapbox.Page);
