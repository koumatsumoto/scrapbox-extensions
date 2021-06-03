import { concat, Observable, timer } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { findElementOrFail, nodeChange } from '../../common';
import { RawScrapbox } from '../types';

// NOTE: scrapbox.Project.name is set after react bootstrapped
const isScrapboxReady = () => Boolean(window.scrapbox.Project && window.scrapbox.Project.name);

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

export class ScrapboxScriptApi {
  private static pageChange: Observable<void>;

  static get data() {
    if (!isScrapboxReady()) {
      throw new Error('window.scrapbox is not set');
    }

    return window.scrapbox;
  }

  static get ready() {
    return scrapboxReady();
  }

  static get update() {
    this.pageChange = this.pageChange || nodeChange(findElementOrFail('#app-container .page'), { childList: true, subtree: true });

    return concat(this.ready, this.pageChange).pipe(
      map(() => this.data),
      share(),
    );
  }

  static get pageTitle() {
    return this.data.Page.title || '';
  }

  static get pageLines() {
    return this.data.Page.lines || [];
  }

  static get projectName() {
    return this.data.Project.name;
  }
}
