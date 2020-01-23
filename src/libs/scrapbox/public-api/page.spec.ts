import { isEmptyPage } from './page';

describe('page', () => {
  const lines: any[] = [
    { id: '1', text: 'hello' },
    { id: '2', text: 'world' },
    { id: '3', text: 'hello world' },
  ];

  it('should work', () => {
    expect(isEmptyPage(lines)).toBe(false);
    expect(isEmptyPage([{ text: 'hello' }] as any)).toBe(false);
    expect(isEmptyPage([{ text: '' }] as any)).toBe(true);
  });
});
