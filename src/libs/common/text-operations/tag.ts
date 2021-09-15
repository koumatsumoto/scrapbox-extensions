export const makeTag = (text: string) => {
  if (text.length < 1) {
    return '';
  }

  return text[0] !== '#' ? `#${text}` : text;
};

export const isTagString = (val: unknown) => typeof val === 'string' && val[0] === '#';

// '#text' => 'text'
export const extractWord = (val: string) => val.slice(1);
