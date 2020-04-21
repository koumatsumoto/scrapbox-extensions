import { Either, left, right } from 'fp-ts/es6/Either';
import { TagLine, TextStartWithHash } from '../../../../libs/scrapbox/types';
import { allTagWords } from '../../add-episode-button/config';
import { Tag } from '../types';

// full-width space separator is allowed
export const splitToWords = (text: TagLine['text']): string[] => text.split(/\s/);
// e.g. '#word'
export const isValidTagText = (word: string): word is TextStartWithHash => /^#\S+$/.test(word);
// e.g. '#word' => 'word'
export const extractWord = (word: TextStartWithHash) => word.slice(1);

// TODO: implement more types
export const classifyTag = (word: string) => {
  return allTagWords.includes(word) ? 'unknown' : 'ideation';
};

export const parseTagLine = (line: TagLine): Either<Error, Tag[]> => {
  const words = splitToWords(line.text);
  const tags: Tag[] = [];
  for (const word of words) {
    // validation
    if (!isValidTagText(word)) {
      return left(new Error(`${word} is invalid`));
    }

    tags.push({
      name: extractWord(word),
      raw: word,
      type: classifyTag(word),
    });
  }

  return right(tags);
};