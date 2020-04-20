import { extractWord, splitToWords, validateTagText } from './tag';

describe('tag parser', () => {
  test('parseTags', () => {
    expect(splitToWords('#2020/04/17 #13:00　#S #A' as any)).toEqual(['#2020/04/17', '#13:00', '#S', '#A']);
  });

  test('validateTagText', () => {
    expect(validateTagText('#w')).toBeTruthy();
    expect(validateTagText('#日本語')).toBeTruthy();
    expect(validateTagText('#word_with_underscore')).toBeTruthy();
    expect(validateTagText('#word with space')).toBeFalsy();
    expect(validateTagText('non-hash')).toBeFalsy();
  });

  test('extractWord', () => {
    expect(extractWord('#word' as any)).toBe('word');
  });
});
