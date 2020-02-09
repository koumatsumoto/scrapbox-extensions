import { createLineInsertions } from './create-line-insertions';

describe('createLineInsertions', () => {
  const words = ['tag1', 'tag2'];
  const date = new Date(1581218918036); // 2020-02-09T03:28:38.036Z
  const dailyTitleOnly = [{ text: '2020/02/08' }] as any;
  const dailyTitleEOF = [{ text: '2020/02/08' }, { text: '' }] as any;
  const symbolTitleOnly = [{ text: 'Symbol' }] as any;
  const symbolTitleEOF = [{ text: 'Symbol' }, { text: '' }] as any;
  const hasPreviousTags = [{ text: 'Symbol' }, { text: '#tag' }] as any;

  it('should work', () => {
    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2019-05-14T11:01:58.135Z').valueOf());

    expect(createLineInsertions(words, date, dailyTitleOnly)).toEqual([{ text: '#12:00 #tag1 #tag2' }, { text: '' }]);
    expect(createLineInsertions(words, date, dailyTitleEOF)).toEqual([{ text: '#12:00 #tag1 #tag2' }, { text: '' }]);
    expect(createLineInsertions(words, date, symbolTitleOnly)).toEqual([{ text: '#2020/02/09 #tag1 #tag2' }, { text: '' }]);
    expect(createLineInsertions(words, date, symbolTitleEOF)).toEqual([{ text: '#2020/02/09 #tag1 #tag2' }, { text: '' }]);
    expect(createLineInsertions(words, date, hasPreviousTags)).toEqual([{ text: '' }, { text: '#2020/02/09 #tag1 #tag2' }, { text: '' }]);
  });
});
