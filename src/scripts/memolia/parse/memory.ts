import { pipe } from 'fp-ts/pipeable';
import { USLine } from 'scrapbox-tools/';
import { Memory, Name } from '../types';
import { BlockParseResult, parseToBlock } from './block';
import { makeEpisode } from './episode';

// TODO: refine types
export const makeFromBlock = (blocks: BlockParseResult): Memory => {
  return {
    name: blocks.title.of as Name,
    semanteme: blocks.semanteme ? (blocks.semanteme as any) : null,
    episodes: blocks.episodes.map(makeEpisode),
  };
};

export const makeMemory = (lines: USLine[]) => pipe(parseToBlock(lines), makeFromBlock);
