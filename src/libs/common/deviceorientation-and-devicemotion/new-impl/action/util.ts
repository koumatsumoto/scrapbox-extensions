import { Movement } from '../movement/classify-movement';

export type RelativeMovement = {
  rate: -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;
  // all direction of value change is same
  align: boolean;
};

export const simplifyMovements = (movements: Movement[]): RelativeMovement[] => {
  if (movements.length < 1) {
    return [];
  }

  const base = movements[0].direction;

  return movements.map((m) => {
    if (m.direction === base) {
      return {
        rate: m.rate,
        align: m.align,
      };
    } else {
      return {
        rate: m.rate === 0 ? 0 : (-m.rate as RelativeMovement['rate']),
        align: m.align,
      };
    }
  });
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
