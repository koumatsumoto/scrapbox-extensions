import { contain, simplifyMovements } from './util';

describe('simplifyMovements', () => {
  it('should work', () => {
    expect(
      simplifyMovements([
        {
          rate: 1,
          direction: 'up',
        } as any,
        {
          rate: 1,
          direction: 'down',
        } as any,
      ]),
    ).toEqual([1, -1]);
    expect(
      simplifyMovements([
        {
          rate: 0,
          direction: 'up',
        } as any,
        {
          rate: 0,
          direction: 'down',
        } as any,
      ]),
    ).toEqual([0, 0]);
  });
});

describe('contain', () => {
  it('should work', () => {
    const source = [0, 1, 2, 3, 4];
    expect(contain(source, [0, 1, 2])).toBe(true);
    expect(contain(source, [2, 3, 4])).toBe(true);
    expect(contain(source, [0, 1, 3])).toBe(false);
    expect(contain(source, [3, 4, 5])).toBe(false);
  });
});
