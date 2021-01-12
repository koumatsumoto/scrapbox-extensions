import { ChangeRequestCreateParams } from 'scrapbox-tools/scrapbox-client';
import { getDiaryPageTitle, makeTag } from '../../../libs/scrapbox';
import { endWithEmptyLine, getLines } from '../../../libs/scrapbox/browser-api';
import { ScrapboxLine } from '../../../libs/scrapbox/types';

export const getLastLineId = (lines: ScrapboxLine[]): string => lines[lines.length - 1]!.id;

/**
 *
 * @param tagLineText
 * @param lines - for testing
 */
export const makeInsertParams = (words: string[], date: Date = new Date(), lines: ScrapboxLine[] = getLines()) => {
  if (lines.length < 1) {
    throw new Error('Bad impl, this function requires at least one line');
  }

  const changes: ChangeRequestCreateParams[] = [];

  // construct a tag of date or time.
  const diaryTitle = getDiaryPageTitle(date);
  const diaryTitleWithHash = `#${diaryTitle}`;
  const tagLineText = [diaryTitleWithHash, ...words].map(makeTag).join(' ');

  const titleLine = lines[0];
  const title = titleLine.text === '' ? diaryTitle : titleLine.text;

  switch (lines.length) {
    // an empty or title-only page
    // if empty page, need update title with date string
    case 1: {
      // if empty, use date to title.
      changes.push({ type: 'title', title });
      changes.push({ type: 'insert', text: tagLineText });
      changes.push({ type: 'insert', text: '' });
      changes.push({ type: 'description', text: tagLineText });

      break;
    }
    // title and description or empty line
    // if empty line, replace it with tag line
    case 2: {
      if (endWithEmptyLine(lines)) {
        changes.push({ type: 'insert', text: tagLineText, position: getLastLineId(lines) });
        changes.push({ type: 'insert', text: '' });
      } else {
        changes.push({ type: 'insert', text: '' });
        changes.push({ type: 'insert', text: tagLineText });
        changes.push({ type: 'insert', text: '' });
      }

      break;
    }
    default: {
      if (!endWithEmptyLine(lines)) {
        changes.push({ type: 'insert', text: '' });
      }

      changes.push({ type: 'insert', text: tagLineText });
      changes.push({ type: 'insert', text: '' });
    }
  }

  return changes;
};
