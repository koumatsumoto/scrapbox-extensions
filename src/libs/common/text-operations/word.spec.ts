import { addWord, joinWords, removeWord, splitIntoWords } from './word';

test('splitIntoWords', () => {
  expect(splitIntoWords('a b c')).toEqual(['a', 'b', 'c']);
  expect(splitIntoWords(' a b  c ')).toEqual(['a', 'b', 'c']);
  expect(splitIntoWords(' a b　c ')).toEqual(['a', 'b', 'c']); // full-width space
});

test('joinWords', () => {
  expect(joinWords(['a'])).toEqual('a');
  expect(joinWords(['a', 'b', 'c'])).toEqual('a b c');
});

test('addWord', () => {
  expect(addWord('a b', 'c')).toBe('a b c');
  expect(addWord('a b', 'b')).toBe('a b');
});

test('should remove existing word', () => {
  expect(removeWord('a b c', 'a')).toBe('b c');
  expect(removeWord('a b c', 'd')).toBe('a b c');
});
