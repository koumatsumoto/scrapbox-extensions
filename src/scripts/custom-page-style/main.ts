import { interval } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { styleLines } from './apply-style';

import './styles.scss';

export const customPageStyle = () => {
  interval(1000)
    .pipe(map(() => window.scrapbox))
    .pipe(filter((scrapbox) => scrapbox.Layout === 'page'))
    .subscribe((scrapbox) => {
      styleLines(scrapbox.Page.lines!);
    });
};
