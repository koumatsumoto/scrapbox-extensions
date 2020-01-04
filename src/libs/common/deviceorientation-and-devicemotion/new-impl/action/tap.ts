import { ActionTypes } from '../types';
import { Movement } from '../movement/classify-movement';

export const isTapMotion = (values: [Movement, Movement, Movement]) => {
  const beforeMove = values[0];
  const move = values[1];
  const afterMove = values[2];

  // need start from rate 0 or 1
  if (beforeMove.rate > 1) {
    return false;
  }

  // need move quickly by rate gte 3
  if (move.rate < 3) {
    return false;
  }

  const tapDirection = move.direction;

  // need stable after move
  if (afterMove.direction === tapDirection) {
    if (afterMove.rate > 1) {
      return false;
    }
  } else {
    if (afterMove.rate > 2) {
      return false;
    }
  }

  return true;
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

    const isTap = isTapMotion([values[pointer - 2], values[pointer - 1], values[pointer]]);
    if (isTap) {
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
