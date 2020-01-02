import { Writeable } from '../../../../types';

export type Aggregation = {
  readonly direction: 'up' | 'down' | 'keep';
  readonly up: number;
  readonly down: number;
  readonly keep: number;
  readonly first: number;
  readonly last: number;
  readonly sum: number;
  readonly max: number;
  readonly min: number;
  readonly avg: number;
};

export const aggregate = (values: number[]): Aggregation => {
  if (values.length < 2) {
    throw new Error('bad impl');
  }

  const first = values[0];
  const last = values[values.length - 1];
  let direction: Aggregation['direction'];
  if (first > last) {
    direction = 'up';
  } else if (first < last) {
    direction = 'down';
  } else {
    direction = 'keep';
  }

  const aggregation: Writeable<Aggregation> = {
    direction,
    up: 0,
    down: 0,
    keep: 0,
    first,
    last,
    sum: values[0],
    max: values[0],
    min: values[0],
    avg: values[0],
  };

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

    aggregation.sum += v;
    aggregation.max = Math.max(aggregation.max, v);
    aggregation.min = Math.min(aggregation.min, v);
  }

  aggregation.avg = aggregation.sum / values.length;

  return aggregation;
};
