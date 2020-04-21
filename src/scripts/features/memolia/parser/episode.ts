import { fold, map as eitherMap } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { TagLine } from '../../../../libs/scrapbox/types';
import { Context, Episode, Line } from '../types';
import { EpisodeBlock } from './block';
import { makeContext } from './context';
import { LineWithMetadata, makeLineWithMetadata } from './line';

export const getTagLine = (block: EpisodeBlock) => {
  return block.lines[0] as TagLine;
};

export const isRoot = (context: Context) => {
  return context.tags[context.tags.length - 1].type === 'ideation';
};

export const getEpisodeGlobalStringId = (ep: Pick<Episode, 'of' | 'context'>) => {
  return [...ep.context.tags, ep.of].join('');
};

export const parseChildEpisodes = (block: EpisodeBlock) => {
  const map = new Map<string, Line[]>();
  const lines = block.lines.slice(1); // remove header (a tag-line)
  const linesWithMeta = lines.map(makeLineWithMetadata);

  let constructing: string | null = null;
  let aggregating: LineWithMetadata[] = [];
  for (const line of linesWithMeta) {
    if (constructing) {
      if (line.meta.type === 'empty') {
        aggregating.push(line);
        map.set(constructing, aggregating);
        constructing = null;
        aggregating = [];
      } else if (line.meta.type === 'episode-title') {
        map.set(constructing, aggregating);
        constructing = line.meta.name;
        aggregating = [];
      }
    } else {
      if (line.meta.type === 'episode-title') {
        constructing = line.meta.name;
      }
    }
  }

  return Array.from(map.entries()).map(([name, lines]) => ({
    name,
    lines,
  }));
};

export const makeEpisode = (block: EpisodeBlock) =>
  pipe(
    getTagLine(block),
    makeContext,
    eitherMap((context: Context) => ({ of: block.of, context, lines: block.lines, root: isRoot(context) })),
    fold(
      (a) => a,
      (b) => parseChildEpisodes(b as any) as any,
    ),
  );
