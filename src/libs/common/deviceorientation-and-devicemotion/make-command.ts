import { Observable } from 'rxjs';
import { OrientationAndMotionSummary } from './types';

export const makeCommand = () => (source: Observable<OrientationAndMotionSummary>) => {};
