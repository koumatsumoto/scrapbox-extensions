import { ActionTypes } from '../types';
import { Movement } from '../movement/classify-movement';

const sameDirection = (x: Movement, y: Movement) => x.direction === y.direction;

/**
 *
 * 0 -> 3 -> 1
 * 0 -> 3 -> 0
 * 0 -> 3 -> -1
 * 0 -> 3 -> -2
 * 1 -> 3 -> 0
 * 1 -> 3 -> -1
 * 1 -> 3 -> -2
 * 1 -> 3 -> -3
 * 1 -> -2 -> 1
 * 1 -> -2 -> 2
 * 1 -> -2 -> 3
 * 1 -> -3 -> 0
 * 1 -> -3 -> 1
 * 1 -> -3 -> 2
 *
 * @param values
 */
export const isTap = (values: [Movement, Movement, Movement]) => {
  const first = values[0];
  const second = values[1];
  const third = values[2];

  // 0 start
  if (first.rate === 0) {
    // need gte 3
    if (second.rate < 3) {
      return false;
    }

    const rate = sameDirection(second, third) ? third.rate : -third.rate;
    if (-2 <= rate && rate <= 1) {
      return true;
    } else {
      return false;
    }
  }

  // 1 start
  if (first.rate === 1) {
    if (sameDirection(first, second)) {
      if (second.rate === 3) {
        const rate = sameDirection(second, third) ? third.rate : -third.rate;
        if (-3 <= rate && rate <= 0) {
          return true;
        }
      }
    } else {
      if (second.rate === 2) {
        if (!sameDirection(second, third)) {
          if (1 <= third.rate && third.rate <= 3) {
            return true;
          }
        }
      } else if (second.rate === 3) {
        if (third.rate === 0) {
          return true;
        }

        if (!sameDirection(second, third)) {
          if (1 <= third.rate && third.rate <= 2) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

/**
 * side-tap motion
 *
 * 1. stable
 * 2. sudden acceleration
 * 3. stable
 *
 * @param values
 */
export const detectTap = (values: Movement[]): ActionTypes | null => {
  let pointer = 2;
  let tappedOnce = false;

  const needContinue = true;
  while (needContinue) {
    if (values[pointer] === undefined) {
      break;
    }

    if (isTap([values[pointer - 2], values[pointer - 1], values[pointer]])) {
      if (tappedOnce) {
        return 'double tap';
      }

      tappedOnce = true;
      // check double tap
      pointer += 2;
    } else {
      pointer++;
    }

    continue;
  }

  return tappedOnce ? 'tap' : null;
};
