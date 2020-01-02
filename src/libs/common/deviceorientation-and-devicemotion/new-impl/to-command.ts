// TODO: not implemented
import { MotionClassification } from './aggregate';

export type Command =
  | 'tip'
  | 'double tip'
  | 'shake'
  | 'double shake'
  | 'nothing'
  | 'waiting'
  | 'tip expecting next'
  | 'shake expecting next';

export const toCommand = (values: MotionClassification[]): Command => {
  if (values.length < 2) {
    return 'nothing';
  }

  let startedMovingQuickly = false;
  let startedMovingSlowly = false;
  let throughSlowly = false;
  const reset = () => {
    startedMovingQuickly = false;
    startedMovingSlowly = false;
    throughSlowly = false;
  };

  let tipped = false;
  let shaken = false;
  // used for double tip
  let remainCount = values.length;

  for (let i = 1; --remainCount > 0 && i < values.length; i++) {
    const value = values[i];
    const prev = values[i - 1];

    /**
     * When prev is steady, handle starting
     */
    if (prev.steady) {
      if (value.steady) {
        continue;
      }

      // check quickly or slowly
      startedMovingQuickly = value.rate > 1;
      startedMovingSlowly = !startedMovingQuickly;
      continue;
    }

    /**
     * When prev is moving and current stopped
     */
    if (value.steady) {
      if (startedMovingQuickly && !throughSlowly && !shaken) {
        if (tipped) {
          return 'double tip';
        }

        tipped = true;
        remainCount = 4;
      }

      reset();
      continue;
    }

    /**
     * When prev is moving and current continue moving
     */
    if (prev.direction !== value.direction) {
      if (startedMovingQuickly && !throughSlowly && !tipped) {
        if (shaken) {
          return 'double shake';
        }

        shaken = true;
        remainCount = 4;
      }

      reset();
      continue;
    }

    if (value.rate > 2) {
      // continue acceleration
    } else {
      throughSlowly = true;
    }

    /**
     * When current motion intensify or continue previous
     */
    continue;
  }

  if (remainCount) {
    if (tipped) {
      return 'tip expecting next';
    }
    if (shaken) {
      return 'shake expecting next';
    }
  } else {
    if (tipped) {
      return 'tip';
    }
    if (shaken) {
      return 'shake';
    }
  }

  return 'nothing';
};
