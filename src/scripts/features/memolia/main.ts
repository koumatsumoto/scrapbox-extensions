import { makeBlocks } from './parser/block';

export const useMemolia = () => {
  let prevCount = 0;
  const fn = () => {
    if (window.scrapbox.Page.lines) {
      if (prevCount !== window.scrapbox.Page.lines.length) {
        prevCount = window.scrapbox.Page.lines.length;
        const blocks = makeBlocks(window.scrapbox.Page.lines);
        console.log('[dev] memolia', window.scrapbox.Page.title, blocks);
      }
    }
  };

  fn();
  setInterval(fn, 1000);
};
