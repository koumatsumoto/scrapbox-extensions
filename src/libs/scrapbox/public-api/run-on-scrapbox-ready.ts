import { runOnDocumentReady } from '../../common';
import { getScrapbox } from './scrapbox';

const reactBootstrapCheckInterval = 20;

export const runOnScrapboxReady = (fn: Function) => {
  runOnDocumentReady(() => {
    const id = window.setInterval(() => {
      if (getScrapbox()) {
        window.clearInterval(id);
        fn();
      }
    }, reactBootstrapCheckInterval);
  });
};
