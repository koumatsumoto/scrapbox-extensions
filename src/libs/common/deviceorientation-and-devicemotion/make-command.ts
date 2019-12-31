import { Observable } from 'rxjs';
import { OrientationAndMotionSummary } from './types';
import { getRx } from '../rxjs';

export const makeCommand = () => (source: Observable<OrientationAndMotionSummary>) => {
  const { map, pairwise } = getRx().operators;

  return source.pipe(
    pairwise(),
    map(([prev, curr]) => {}),
  );
};
