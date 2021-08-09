import { USLine } from 'scrapbox-tools/';
import { Tag } from '../types';

// full-width space separator is allowed
export const splitToWords = (text: USLine['text']): string[] => text.split(/\s/);
// e.g. '#word'
export const isValidTagText = (word: string) => /^#\S+$/.test(word);
// e.g. '#word' => 'word'
export const extractWord = (word: string) => word.slice(1);

export const parseTag = (line: USLine): Tag[] => {
  const words = splitToWords(line.text);
  const tags: Tag[] = [];
  for (const word of words) {
    // validation
    if (isValidTagText(word)) {
      tags.push({
        name: extractWord(word),
        raw: word,
      });
    }

    new Error(`"${word}" is invalid`);
  }

  return tags;
};
