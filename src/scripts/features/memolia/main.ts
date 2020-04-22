import { makeBlocks } from './parser/block';
import { makeEpisode } from './parser/episode';

export const useMemolia = () => {
  let prevCount = 0;
  const fn = () => {
    if (window.scrapbox.Page.lines) {
      if (prevCount !== window.scrapbox.Page.lines.length) {
        prevCount = window.scrapbox.Page.lines.length;
        const blocks = makeBlocks(window.scrapbox.Page.lines);
        console.log('[dev] memolia blocks', blocks);
        console.log('[dev] memolia episode parsed', blocks.episodes.map(makeEpisode));
      }
    }
  };

  fn();
  setInterval(fn, 1000);
};
