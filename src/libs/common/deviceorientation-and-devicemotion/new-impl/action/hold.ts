import { Movement } from '../movement/classify-movement';

export const stoppingCount = 4;
export const shortHoldCount = 7;
export const motionEnteringCount = 8;
export const longHoldCount = 10;

const isConsecutiveZero = (movements: Movement[], length: number): boolean => {
  if (movements.length !== length) {
    return false;
  }

  for (let i = 0; i < length; i++) {
    if (movements[i].rate !== 0) {
      return false;
    }
  }

  return true;
};

/**
 *
 * 0 -> 0 -> 0 -> 0 -> 0 -> 0 -> 0 -> 0 -> 0 -> 0
 *
 * @param movements
 */
export const isLongHold = (movements: Movement[]): boolean => {
  return isConsecutiveZero(movements, longHoldCount);
};

/**
 *
 * 0 -> 0 -> 0 -> 0 -> 0 -> 0 -> 0
 *
 * @param movements
 */
export const isShortHold = (movements: Movement[]): boolean => {
  return isConsecutiveZero(movements, shortHoldCount);
};

/**
 *
 * 0 -> 0 -> 0 -> 0
 *
 * @param movements
 */
export const isStopping = (movements: Movement[]): boolean => {
  return isConsecutiveZero(movements, stoppingCount);
};

/**
 *
 * 0 -> 0 -> 0 -> 0 -> 0 -> 0 -> 0 -> 1
 *
 * @param movements
 */
export const checkEnterMotionType = (movements: Movement[]): 'slow' | 'quick' | null => {
  if (movements.length < motionEnteringCount) {
    return null;
  }

  if (isShortHold(movements.slice(0, shortHoldCount))) {
    if (movements[movements.length - 1].rate > 1) {
      return 'quick';
    } else if (movements[movements.length - 1].rate > 0) {
      return 'slow';
    }
  }

  return null;
};
