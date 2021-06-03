import { getPageTitleMap } from './show-datetime';

describe('getPageTitleMap', () => {
  test('should work', () => {
    expect(getPageTitleMap([{ title: 'hello' }, {}, { title: 'world' }, {}] as any)).toEqual(
      new Map([
        ['hello', { title: 'hello' }],
        ['world', { title: 'world' }],
      ]),
    );
  });
});
