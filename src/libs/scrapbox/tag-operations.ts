export const makeTag = (text: string) => {
  if (text.length < 1) {
    return '';
  }

  return text[0] !== '#' ? `#${text}` : text;
};
