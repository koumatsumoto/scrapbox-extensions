import { tail } from 'fp-ts/es6/Array';
import { fold, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { TagLine } from '../../../../libs/scrapbox/types';
import { Context, Line, Memory } from '../types';
import { EpisodeBlock } from './block';
import { makeContext } from './context';
import { makeLineWithMetadata } from './line';

export const getTagLine = (block: EpisodeBlock) => {
  return block.lines[0] as TagLine;
};

export const isRoot = (context: Context) => {
  return context.tags[context.tags.length - 1].type === 'ideation';
};

export const parse = (lines: Line[]) => {
  const map = new Map<Memory['name'], Line[]>();
  const lineWithMetadata = lines.map(makeLineWithMetadata);
  console.log('[dev] parse', lineWithMetadata);
};

export const parseChildEpisodes = (block: EpisodeBlock) =>
  pipe(
    // first line is header (tag-line)
    tail(block.lines),
  );

export const makeEpisode = (block: EpisodeBlock) =>
  pipe(
    getTagLine(block),
    makeContext,
    map((context: Context) => ({ of: block.of, context, lines: block.lines, root: isRoot(context) })),
    fold(
      (a) => a,
      (b) => parse(b.lines) as any,
    ),
  );
