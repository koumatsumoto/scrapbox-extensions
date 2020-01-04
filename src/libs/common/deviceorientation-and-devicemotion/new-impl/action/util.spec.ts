import { contain, simplifyMovements } from './util';

describe('simplifyMovements', () => {
  it('should work', () => {
    expect(
      simplifyMovements([
        {
          rate: 1,
          direction: 'up',
          align: true,
        },
        {
          rate: 1,
          direction: 'down',
          align: false,
        },
      ]),
    ).toEqual([
      {
        rate: 1,
        align: true,
      },
      {
        rate: -1,
        align: false,
      },
    ]);
    expect(
      simplifyMovements([
        {
          rate: 0,
          direction: 'up',
          align: true,
        },
        {
          rate: 0,
          direction: 'down',
          align: false,
        },
      ]),
    ).toEqual([
      {
        rate: 0,
        align: true,
      },
      {
        rate: 0,
        align: false,
      },
    ]);
    expect(
      simplifyMovements([
        {
          rate: 0,
          direction: 'up',
          align: true,
        },
        {
          rate: 0,
          direction: 'down',
          align: false,
        },
        {
          rate: 1,
          direction: 'up',
          align: false,
        },
      ]),
    ).toEqual([
      {
        align: true,
        rate: 0,
      },
      {
        align: false,
        rate: 0,
      },
      {
        align: false,
        rate: 1,
      },
    ]);
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
