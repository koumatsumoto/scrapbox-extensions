// space, full-width space, tab
const regexp = { space: /[\u{20}\u{3000}\t]/gu };

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
