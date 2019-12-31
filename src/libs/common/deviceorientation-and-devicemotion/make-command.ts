import { Observable } from 'rxjs';
import { OrientationAndMotionSummary } from './types';
import { getRx } from '../rxjs';

const makeManipulation = (values: [OrientationAndMotionSummary, OrientationAndMotionSummary]) => {
  const prev = values[0];
  const curr = values[1];
};

export const toManipulation = () => (source: Observable<OrientationAndMotionSummary>) => {
  const { map, pairwise } = getRx().operators;

  return source.pipe(pairwise(), map(makeManipulation));
};
