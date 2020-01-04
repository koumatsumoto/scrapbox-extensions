import { Movement } from '../movement/classify-movement';

/**
 *
 * 0 -> 0 -> 0 -> 0 -> 0 -> 0 -> 0 -> 0 -> 0 -> 0
 *
 * @param movements
 */
export const isLongHold = (movements: Movement[]): boolean => {
  if (movements.length < 10) {
    return false;
  }

  for (let i = 0; i < movements.length; i++) {
    if (movements[i].rate !== 0) {
      return false;
    }
  }

  return true;
};

/**
 *
 * 0 -> 0 -> 0 -> 0
 *
 * @param movements
 */
export const isShortHold = (movements: Movement[]): boolean => {
  if (movements.length < 4) {
    return false;
  }

  for (let i = 0; i < movements.length; i++) {
    if (movements[i].rate !== 0) {
      return false;
    }
  }

  return true;
};

/**
 *
 * 0 -> 0 -> 0 -> 0 -> 1
 *
 * @param movements
 */
export const checkEnterMotionType = (movements: Movement[]): 'slow' | 'quick' | null => {
  if (movements.length < 5) {
    return null;
  }

  if (isShortHold(movements.slice(0, 4))) {
    if (movements[4].rate > 1) {
      return 'quick';
    } else if (movements[4].rate > 0) {
      return 'slow';
    }
  }

  return null;
};
