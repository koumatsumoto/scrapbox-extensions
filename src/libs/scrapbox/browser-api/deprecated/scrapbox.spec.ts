import { getFirstLineOrFail, getPageTitleMap } from './scrapbox';

describe('scrap box public api', () => {
  describe('getFirstLineOrFail', () => {
    it('should get first line', () => {
      const first = {};
      expect(
        getFirstLineOrFail({
          Page: { lines: [first] },
        } as any),
      ).toEqual(first);
    });

    it('should throw if first line not found', () => {
      expect(() =>
        getFirstLineOrFail({
          Page: { lines: [] },
        } as any),
      ).toThrow();
    });
  });

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
});
