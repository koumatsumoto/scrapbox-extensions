import { MotionClassification } from './aggregate';
import { CommandTypes } from './to-command';

type State = {
  // used for double tip, shake
  remainCount: number;
  tip: number;
  /**
   * 0: searching tip start signal
   * 1: checking next value after tip start signal
   * 2: waiting for next steady to start searching next tip
   */
  mode: 0 | 1 | 2;
  tipPosition: number[];
  tipOnce: boolean;
  doubletipCheckCount: number;
};

const createState = (): State => ({
  // updated and used for double tip and shake action
  remainCount: 100,
  tip: 0,
  mode: 0,
  tipPosition: [],
  tipOnce: false,
  doubletipCheckCount: 2,
});

export const makeTip = (values: MotionClassification[]): CommandTypes => {
  const state = createState();
  for (let i = 1; i < values.length; i++) {
    const current = values[i];
    const previous = values[i - 1];

    if (current.rate > 2 && (previous.steady || previous.direction !== current.direction)) {
      if (state.tipOnce) {
        return 'double tip';
      }

      state.tipOnce = true;
      continue;
    }

    if (state.tipOnce && --state.doubletipCheckCount > 0) {
      return 'tip';
    }
  }

  if (state.tipOnce) {
    return state.doubletipCheckCount > 0 ? 'tip expecting next' : 'tip';
  }

  return 'nothing';
};
