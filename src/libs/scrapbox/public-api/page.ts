import { PageLine } from '../../../types/scrapbox';
import { getTitleLine } from './line';
import { getLines } from './scrapbox';

export const isEmptyPage = (lines: PageLine[] = getLines()) => {
  const title = getTitleLine(lines);

  return lines.length === 1 && title.text === '';
};
