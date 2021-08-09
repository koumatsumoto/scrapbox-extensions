import { ChangeRequestCreateParams, USLine } from 'scrapbox-tools';
import { getDiaryPageTitle, makeTag } from '../../../libs';

export const endWithEmptyLine = (lines: USLine[]) => {
  const last = lines[lines.length - 1];

  return last.text === '';
};

export const getLastLineId = (lines: USLine[]): string => lines[lines.length - 1]!.id;
const EMPTY_LINE = '';

/**
 *
 * @param tagLineText
 * @param lines - for testing
 */
export const makeInsertParams = (words: string[], date: Date = new Date(), lines: USLine[]) => {
  if (lines.length < 1) {
    throw new Error('Bad impl, this function requires at least one line');
  }

  const changes: ChangeRequestCreateParams[] = [];
  const titleLine = lines[0];
  const diaryTitle = getDiaryPageTitle(date);
  const tags = [`#${diaryTitle}`, ...words].map(makeTag).join(' ');

  switch (lines.length) {
    // an empty or title-only page
    // if empty page, need update title with date string
    case 1: {
      changes.push({ type: 'title', title: titleLine.text || diaryTitle });
      changes.push({ type: 'insert', text: tags });
      changes.push({ type: 'insert', text: EMPTY_LINE });
      changes.push({ type: 'description', text: tags });

      break;
    }
    // title and description or empty line
    // if empty line, replace it with tag line
    case 2: {
      if (endWithEmptyLine(lines)) {
        changes.push({ type: 'insert', text: tags, position: getLastLineId(lines) });
        changes.push({ type: 'insert', text: EMPTY_LINE });
      } else {
        changes.push({ type: 'insert', text: EMPTY_LINE });
        changes.push({ type: 'insert', text: tags });
        changes.push({ type: 'insert', text: EMPTY_LINE });
      }

      break;
    }
    default: {
      if (!endWithEmptyLine(lines)) {
        // insert a line break
        changes.push({ type: 'insert', text: EMPTY_LINE });
      }

      changes.push({ type: 'insert', text: tags });
      changes.push({ type: 'insert', text: EMPTY_LINE });
    }
  }

  return changes;
};
