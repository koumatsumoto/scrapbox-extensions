import { Observable, timer } from 'rxjs';
import { concatWith, distinctUntilChanged, map, share } from 'rxjs/operators';
import { nodeChange } from '../../common';
import { RawScrapbox } from '../types';

// NOTE: scrapbox.Project.name is set after react bootstrapped
const isScrapboxReady = () => Boolean(window.scrapbox.Project && window.scrapbox.Project.name);
const isSameScrapbox = (prev: RawScrapbox, next: RawScrapbox) => {
  return prev.Layout === next.Layout && prev.Page.lines === next.Page.lines && prev.Project.pages === next.Project.pages;
};

export const scrapboxReady = () => {
  return new Observable<RawScrapbox>((subscriber) => {
    const subscription = timer(0, 30).subscribe(() => {
      if (isScrapboxReady()) {
        subscriber.next(window.scrapbox);
        subscriber.complete();
        subscription.unsubscribe();
      }
    });

    return subscription;
  });
};

export class ScrapboxUserScriptApi {
  readonly data = scrapboxReady()
    .pipe(concatWith(nodeChange(window.document.body, { childList: true }).pipe(map(() => window.scrapbox))))
    .pipe(distinctUntilChanged(isSameScrapbox));
}
