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
  let startDirection: MotionClassification['direction'] | null = null;
  let countAfterFirstMoveUntilSteady = 0;

  let tipped = false;
  let shaken = false;
  // used for double tip
  let remainCount = values.length;

  for (let i = 1; i < values.length && remainCount-- > 0; i++) {
    const value = values[i];
    const prev = values[i - 1];

    /**
     * When prev is steady, handle starting
     */
    if (prev.steady) {
      if (value.steady) {
        continue;
      }

      // start moving
      countAfterFirstMoveUntilSteady = 1;
      startDirection = value.direction;
      // check quickly or slowly
      const quickly = value.rate > 1;
      startedMovingQuickly = quickly;
      startedMovingSlowly = !quickly;
      continue;
    }

    /**
     * When prev is moving and current stopped
     */
    if (value.steady) {
      if (startedMovingQuickly && !shaken) {
        if (tipped) {
          return 'double tip';
        }

        tipped = true;
        remainCount = 3;
      }

      startedMovingQuickly = false;
      startedMovingSlowly = false;
      continue;
    }

    /**
     * When prev is moving and current continue moving
     */
    if (prev.direction !== value.direction) {
      if (!tipped) {
        if (shaken) {
          return 'double shake';
        }

        shaken = true;
        remainCount = 3;
      }

      startedMovingQuickly = false;
      startedMovingSlowly = false;
      continue;
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
