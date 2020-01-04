import { ActionTypes } from '../types';
import { Movement } from '../movement/classify-movement';
import { within } from '../../../arithmetic';
import { simplifyMovements } from './util';

/**
 *
 * 0 -> 3 -> -3
 * 0 -> 3 -> -2
 * 0 -> 3 -> -1
 * 0 -> 3 -> 0
 * 0 -> 3 -> 1
 * 1 -> 3 -> -3
 * 1 -> 3 -> -2
 * 1 -> 3 -> -1
 * 1 -> 3 -> 0
 * 1 -> -2 -> 1
 * 1 -> -2 -> 2
 * 1 -> -2 -> 3
 * 1 -> -3 -> -1
 * 1 -> -3 -> 0
 * 1 -> -3 -> 1
 * 1 -> -3 -> 2
 *
 * @param movements
 */
export const isTap = (movements: [Movement, Movement, Movement]) => {
  const values = simplifyMovements(movements);
  const first = values[0];
  const second = values[1];
  const third = values[2];

  if (first.rate === 0) {
    if (second.rate === 3) {
      if (within(third.rate, -3, 1)) {
        return true;
      }
    }
  }

  if (first.rate === 1) {
    if (second.rate === 3) {
      if (within(third.rate, -3, 0)) {
        return true;
      }
    } else if (second.rate === -2) {
      if (within(third.rate, 1, 3)) {
        return true;
      }
    } else if (second.rate === -3) {
      if (within(third.rate, -1, 2)) {
        return true;
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
