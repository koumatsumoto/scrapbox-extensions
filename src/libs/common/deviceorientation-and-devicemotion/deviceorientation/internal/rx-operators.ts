import { Observable } from 'rxjs';
import { getRx } from '../../../rxjs';
import { PartialDeviceOrientation } from '../../types';
import { isEntireDeviceOrientation } from './is-entire-device-orientation';

/**
 * strip unnecessary properties
 */
export const extract = () => (source: Observable<PartialDeviceOrientation>) => {
  const { map } = getRx().operators;

  return source.pipe(
    map((v) => ({
      absolute: v.absolute,
      alpha: v.alpha,
      beta: v.beta,
      gamma: v.gamma,
    })),
  );
};

export const filterAndExtract = () => (source: Observable<PartialDeviceOrientation>) => {
  const { filter } = getRx().operators;

  return source.pipe(extract(), filter(isEntireDeviceOrientation));
};
