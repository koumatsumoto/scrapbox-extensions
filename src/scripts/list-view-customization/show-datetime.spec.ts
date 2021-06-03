import { getPageTitleMap } from './show-datetime';

describe('getPageTitleMap', () => {
  it('should work', () => {
    expect(getPageTitleMap({ Project: { pages: [{ title: 'hello' }, {}, { title: 'world' }, {}] } } as any)).toEqual(
      new Map([
        ['hello', { title: 'hello' }],
        ['world', { title: 'world' }],
      ]),
    );
  });
});
