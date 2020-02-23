export const splitWords = (text: string) =>
  text
    .split(' ')
    .map((str) => str.trim())
    .filter((wordOrEmpty) => !!wordOrEmpty);

export const joinWords = (words: string[]) => words.join(' ');

export const addWord = (word: string, textarea: HTMLTextAreaElement) => {
  const words = splitWords(textarea.value);
  if (!words.includes(word)) {
    words.push(word);
  }

  textarea.value = joinWords(words);
};

export const removeWord = (word: string, textarea: HTMLTextAreaElement) => {
  const existing = splitWords(textarea.value);
  const result: string[] = [];

  for (const e of existing) {
    if (e !== word) {
      result.push(e);
    }
  }

  textarea.value = joinWords(result);
};
