import { map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { TagLine } from '../../../../libs/scrapbox/types';
import { Context } from '../types';
import { EpisodeBlock } from './block';
import { makeContext } from './context';

export const getTagLine = (block: EpisodeBlock) => {
  return block.lines[0] as TagLine;
};

export const isRoot = (context: Context) => {
  return context.tags[context.tags.length - 1].type === 'ideation';
};

export const makeEpisode = (block: EpisodeBlock) =>
  pipe(
    getTagLine(block),
    makeContext,
    map((context: Context) => ({ of: block.of, context, lines: block.lines, root: isRoot(context) })),
  );
