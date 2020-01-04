import { Movement } from '../movement/classify-movement';

export type RelativeMovement = {
  rate: -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;
  // all direction of value change is same
  align: boolean;
};

export const simplifyMovements = (movements: Movement[]): RelativeMovement[] => {
  if (movements.length < 2) {
    throw new Error('bad impl');
  }

  const results: RelativeMovement[] = [
    {
      rate: movements[0].rate,
      align: movements[0].align,
    },
  ];

  for (let i = 1; i < movements.length; i++) {
    const prev = movements[i - 1];
    const curr = movements[i];

    if (prev.rate === 0) {
      results.push({
        rate: curr.rate,
        align: curr.align,
      });
    } else {
      if (curr.direction === prev.direction) {
        results.push({
          rate: curr.rate,
          align: curr.align,
        });
      } else {
        results.push({
          rate: curr.rate === 0 ? 0 : (-curr.rate as RelativeMovement['rate']),
          align: curr.align,
        });
      }
    }
  }

  return results;
};

export const contain = (source: number[], pattern: number[]): boolean => {
  for (let i = 0; i <= source.length - pattern.length; i++) {
    let mismatch = false;
    for (let j = 0; j < pattern.length; j++) {
      if (pattern[j] === source[i + j]) {
        continue;
      } else {
        mismatch = true;
        break;
      }
    }

    if (!mismatch) {
      return true;
    }
  }

  return false;
};
