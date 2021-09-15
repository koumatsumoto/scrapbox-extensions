// space, full-width space, tab
const regexp = {
  space: /[\u{20}\u{3000}\t]/gu,
};

export const splitIntoWords = (text: string) => {
  return text
    .split(regexp.space)
    .map((v) => v.trim())
    .filter(Boolean);
};

export const joinWords = (words: string[]) => {
  return words.join(' ');
};

export const addWord = (text: string, word: string) => {
  const words = splitIntoWords(text);

  return joinWords(words.includes(word) ? words : [...words, word]);
};

export const removeWord = (text: string, word: string) => {
  const words = splitIntoWords(text);

  return joinWords(words.filter((w) => w !== word));
};

export const toTag = (text: string) => {
  if (text.length < 1) {
    return '';
  }

  return text[0] !== '#' ? `#${text}` : text;
};

export const isTagString = (val: unknown) => typeof val === 'string' && val[0] === '#';

// '#text' => 'text'
export const extractWord = (val: string) => val.slice(1);
