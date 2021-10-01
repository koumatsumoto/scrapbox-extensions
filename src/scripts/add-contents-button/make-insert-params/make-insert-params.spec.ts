import { endWithEmptyLine, makeInsertParams } from './make-insert-params';

const jstOffset = -540; // UTC+9

/**
 * for testing
 *
 * @param param
 */
export const getFakeJSTDate = (param: number | string) => {
  const date = new Date(param);

  if (date.getTimezoneOffset() === jstOffset) {
    return date;
  } else {
    return new Date(date.getTime() + -jstOffset * 60 * 1000);
  }
};

describe('makeInsertParams', () => {
  const words = ['tag1', 'tag2'];
  const date = getFakeJSTDate('2020-02-09T03:28:38.036Z');
  const emptyPage = [{ text: '', id: 'id' }] as any;
  const dailyTitleOnly = [{ text: '2020-02-08', id: 'id' }] as any;
  const dailyTitleWithAnEmptyLine = [{ text: '2020-02-09' }, { text: '' }] as any;
  const symbolTitleOnly = [{ text: 'Symbol', id: 'id' }] as any;
  const symbolTitleEOF = [{ text: 'Symbol' }, { text: '' }] as any;
  const hasPreviousTags = [{ text: 'Symbol' }, { text: '#tag' }] as any;
  const has3Lines = [{ text: 'Symbol' }, { text: '#tag' }, { text: 'text' }] as any;
  const has3LinesEOF = [{ text: 'Symbol' }, { text: '#tag' }, { text: '' }] as any;

  it('should work', () => {
    expect(makeInsertParams(words, date, emptyPage)).toEqual([
      { type: 'title', title: '2020-02-09' },
      { type: 'insert', text: '#2020-02-09 #tag1 #tag2' },
      { type: 'insert', text: '' },
      { type: 'description', text: '#2020-02-09 #tag1 #tag2' },
    ]);
    expect(makeInsertParams(words, date, dailyTitleOnly)).toEqual([
      { type: 'title', title: '2020-02-08' },
      { type: 'insert', text: '#2020-02-09 #tag1 #tag2' },
      { type: 'insert', text: '' },
      { type: 'description', text: '#2020-02-09 #tag1 #tag2' },
    ]);
    expect(makeInsertParams(words, date, dailyTitleWithAnEmptyLine)).toEqual([
      { type: 'insert', text: '#2020-02-09 #tag1 #tag2' },
      { type: 'insert', text: '' },
    ]);
    expect(makeInsertParams(words, date, symbolTitleOnly)).toEqual([
      { type: 'title', title: 'Symbol' },
      { type: 'insert', text: '#2020-02-09 #tag1 #tag2' },
      { type: 'insert', text: '' },
      { type: 'description', text: '#2020-02-09 #tag1 #tag2' },
    ]);
    expect(makeInsertParams(words, date, symbolTitleEOF)).toEqual([
      { type: 'insert', text: '#2020-02-09 #tag1 #tag2' },
      { type: 'insert', text: '' },
    ]);
    expect(makeInsertParams(words, date, hasPreviousTags)).toEqual([
      { type: 'insert', text: '' },
      { type: 'insert', text: '#2020-02-09 #tag1 #tag2' },
      { type: 'insert', text: '' },
    ]);
    expect(makeInsertParams(words, date, has3Lines)).toEqual([
      { type: 'insert', text: '' },
      { type: 'insert', text: '#2020-02-09 #tag1 #tag2' },
      { type: 'insert', text: '' },
    ]);
    expect(makeInsertParams(words, date, has3LinesEOF)).toEqual([
      { type: 'insert', text: '#2020-02-09 #tag1 #tag2' },
      { type: 'insert', text: '' },
    ]);
  });
});

describe('page', () => {
  describe('endWithEmptyLine', () => {
    it('should work', () => {
      expect(
        endWithEmptyLine([
          { id: '1', text: 'hello' },
          { id: '2', text: 'world' },
          { id: '3', text: 'hello world' },
        ] as any),
      ).toBe(false);
      expect(endWithEmptyLine([{ text: '' }] as any)).toBe(true);
      expect(endWithEmptyLine([{ text: 'first' }, { text: '' }] as any)).toBe(true);
    });
  });
});
