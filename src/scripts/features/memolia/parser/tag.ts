import { TagLine, TextStartWithHash } from '../../../../libs/scrapbox/types';
import { Tag } from '../types';
import { ParseResult } from './types';

// full-width space separator is allowed
export const splitToWords = (text: TagLine['text']): string[] => text.split(/\s/);
// e.g. '#word'
export const isValidTagText = (word: string): word is TextStartWithHash => /^#\S+$/.test(word);
// e.g. '#word' => 'word'
export const extractWord = (word: TextStartWithHash) => word.slice(1);

export const parseTagLine = (line: TagLine): ParseResult<Tag[]> => {
  try {
    const words = splitToWords(line.text);
    const tags: Tag[] = [];
    for (const word of words) {
      // validation
      if (!isValidTagText(word)) {
        throw new Error(`${word} is invalid`);
      }

      tags.push({
        name: extractWord(word),
        raw: word,
        // TODO: implement type sorting
        type: 'unknown',
      });
    }

    return {
      valid: true,
      data: tags,
    };
  } catch (e) {
    return {
      valid: false,
      error: e,
    };
  }
};
