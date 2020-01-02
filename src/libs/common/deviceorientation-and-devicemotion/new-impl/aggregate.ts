import { Writeable } from '../../../../types';
import { roundToInt } from '../../arithmetic';

/**
 * NOTE:
 *
 * - orientation.gamma
 *   - positive if right
 *   - negative if left
 * - rotationRate.gamma
 *   - positive if tilting to left
 *   - negative if tilting to right
 *
 */
export type Aggregation = {
  readonly up: number;
  readonly down: number;
  readonly keep: number;
  readonly first: number;
  readonly last: number;
  readonly max: number;
  readonly min: number;
  readonly avg: number;
};

// TODO: use integer for performance
export type MotionTypes =
  | 'neutral'
  | 'right strongly'
  | 'right weakly'
  | 'right to left'
  | 'right continuously'
  | 'left strongly'
  | 'left weakly'
  | 'left to right'
  | 'left continuously';

export const toType = (a: Aggregation): MotionTypes => {
  // tilt to right
  if (a.first < 0) {
    // getting stronger
    if (a.last < a.first) {
      return 'right strongly';
    } else if (a.first < a.last) {
      if (a.last < 0) {
        return 'right weakly';
      } else {
        return 'right to left';
      }
    } else {
      return 'right continuously';
    }
  } else if (a.first > 0) {
    // getting stronger
    if (a.first < a.last) {
      return 'left strongly';
    } else if (a.first > a.last) {
      if (a.last > 0) {
        return 'left weakly';
      } else {
        return 'left to right';
      }
    } else {
      return 'left continuously';
    }
  } else {
    return 'neutral';
  }
};

export const aggregate = (values: number[]): Aggregation => {
  if (values.length < 2) {
    throw new Error('bad impl');
  }

  const first = values[0];
  const last = values[values.length - 1];

  const aggregation: Writeable<Aggregation> = {
    up: 0,
    down: 0,
    keep: 0,
    first,
    last,
    max: values[0],
    min: values[0],
    avg: values[0],
  };

  let sum = 0;
  for (let i = 1; i < values.length; i++) {
    const p = values[i - 1];
    const v = values[i];
    if (v > p) {
      aggregation.up++;
    } else if (v < p) {
      aggregation.down++;
    } else {
      aggregation.keep++;
    }

    sum += v;
    aggregation.max = Math.max(aggregation.max, v);
    aggregation.min = Math.min(aggregation.min, v);
  }

  aggregation.avg = sum / values.length;

  // should set by calibration
  const base = 12;

  aggregation.avg = roundToInt(aggregation.avg / base);
  aggregation.min = roundToInt(aggregation.min / base);
  aggregation.max = roundToInt(aggregation.max / base);
  aggregation.first = roundToInt(aggregation.first / base);
  aggregation.last = roundToInt(aggregation.last / base);

  return aggregation;
};
