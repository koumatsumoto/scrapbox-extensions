import { EpisodeBlock, makeBlocks } from './parser/block';
import { makeEpisode } from './parser/episode';

export const useMemolia = () => {
  let prevCount = 0;
  const fn = () => {
    if (window.scrapbox.Page.lines) {
      if (prevCount !== window.scrapbox.Page.lines.length) {
        prevCount = window.scrapbox.Page.lines.length;
        const blocks = makeBlocks(window.scrapbox.Page.lines);
        console.log('[dev] memolia', window.scrapbox.Page.title, blocks);
        console.log(
          '[dev] memolia episode blocks',
          blocks.filter((b) => b.type === 'episode'),
        );
        console.log(
          '[dev] memolia episode parsed',
          blocks.filter((b) => b.type === 'episode').map((b) => makeEpisode(b as EpisodeBlock)),
        );
      }
    }
  };

  fn();
  setInterval(fn, 1000);
};
