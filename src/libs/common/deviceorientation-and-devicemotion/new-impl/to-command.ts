// TODO: not implemented
import { MotionClassification } from './aggregate';

export type CommandTypes =
  | 'tip'
  | 'double tip'
  | 'shake'
  | 'double shake'
  | 'nothing'
  | 'waiting'
  | 'tip expecting next'
  | 'shake expecting next';

export type Command = {
  action: CommandTypes;
  meta: {
    length: number;
    previous?: MotionClassification;
    firstTip?: MotionClassification;
    firstShake?: MotionClassification;
  };
};

export const toCommand = (values: MotionClassification[]): Command => {
  if (values.length < 2) {
    return {
      action: 'nothing',
      meta: {
        length: values.length,
      },
    };
  }

  // meta
  let firstTip: MotionClassification | undefined;
  let firstShake: MotionClassification | undefined;

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
    const previous = values[i - 1];

    /**
     * When prev is steady, handle starting
     */
    if (previous.steady) {
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
          return {
            action: 'double tip',
            meta: {
              length: values.length,
              previous,
              firstTip,
            },
          };
        }

        tipped = true;
        firstTip = value;
        remainCount = 4;
      }

      reset();
      continue;
    }

    /**
     * When prev is moving and current continue moving
     */
    if (previous.direction !== value.direction) {
      if (startedMovingQuickly && !throughSlowly && !tipped) {
        if (shaken) {
          return {
            action: 'double shake',
            meta: {
              length: values.length,
              previous,
              firstShake,
            },
          };
        }

        shaken = true;
        firstShake = value;
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
      return {
        action: 'tip expecting next',
        meta: {
          length: values.length,
          firstTip,
        },
      };
    }
    if (shaken) {
      return {
        action: 'shake expecting next',
        meta: {
          length: values.length,
          firstShake,
        },
      };
    }
  } else {
    if (tipped) {
      return {
        action: 'tip',
        meta: {
          length: values.length,
          firstTip,
        },
      };
    }
    if (shaken) {
      return {
        action: 'shake',
        meta: {
          length: values.length,
          firstShake,
        },
      };
    }
  }

  return {
    action: 'nothing',
    meta: {
      length: values.length,
    },
  };
};
