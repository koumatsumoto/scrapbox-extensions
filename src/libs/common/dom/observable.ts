import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

export const documentReady = () => {
  return new Observable<void>((subscriber) => {
    if (window.document.readyState === 'complete' || window.document.readyState === 'interactive') {
      subscriber.next();
      subscriber.complete();
      return;
    }

    window.document.addEventListener(
      'DOMContentLoaded',
      () => {
        subscriber.next();
        subscriber.complete();
      },
      { once: true },
    );
  });
};

export const nodeChange = <N extends Node>(node: N, options: MutationObserverInit) => {
  return new Observable<N>((subscriber) => {
    const mo = new MutationObserver(() => subscriber.next());
    mo.observe(node, options);

    return () => mo.disconnect();
  }).pipe(share());
};
