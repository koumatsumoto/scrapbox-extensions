import { isLeft } from 'fp-ts/es6/Either';
import { TagLine } from '../../../../libs/scrapbox/types';
import { EpisodeBlock } from './block';
import { makeContext } from './context';

export const makeEpisode = (title: string, block: EpisodeBlock) => {
  const tagLine = block.lines[0] as TagLine;
  const context = makeContext(tagLine);
  if (isLeft(context)) {
    return context;
  }

  const id = { of: title };
};
