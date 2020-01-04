import { Movement } from '../movement/classify-movement';

export const simplifyMovements = (movements: Movement[]): number[] => {
  if (movements.length < 1) {
    return [];
  }

  const base = movements[0].direction;

  return movements.map((m) => {
    if (m.direction === base) {
      return m.rate;
    } else {
      return m.rate === 0 ? 0 : -m.rate;
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
