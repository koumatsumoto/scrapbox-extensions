import { fold, map as eitherMap } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { TagLine } from '../../../../libs/scrapbox/types';
import { ChildEpisode, Context } from '../types';
import { EpisodeBlock } from './block';
import { makeContext } from './context';
import { makeLineWithMetadata } from './line';
import { parseTag } from './tag';

export const getTagLine = (block: EpisodeBlock) => {
  return block.lines[0] as TagLine;
};

export const isRoot = (context: Context) => {
  return context.tags[context.tags.length - 1].type === 'ideation';
};

export const parseChildEpisodes = (block: EpisodeBlock) => {
  const header = block.lines[0] as TagLine;
  const lines = block.lines.slice(1); // remove header (a tag-line)
  if (header == null || lines.length < 1) {
    return;
  }

  const getBaseContext = () => [...parseTag(header).map((t) => t.name), block.of];
  const map = new Map<string, ChildEpisode>();
  const merge = (v: ChildEpisode) => {
    const key = [...v.context, v.for].join();
    const exist = map.get(key);
    if (exist) {
      map.set(key, { ...exist, lines: [...exist.lines, ...v.lines] });
    } else {
      map.set(key, v);
    }
  };

  const linesWithMeta = lines.map(makeLineWithMetadata);
  let ep: ChildEpisode | null = null;

  for (const line of linesWithMeta) {
    if (ep) {
      if (line.meta.type === 'empty') {
        merge(ep);
        ep = null;
      } else if (line.meta.type === 'episode-title') {
        merge(ep);
        const oldContext = ep.context as string[];
        ep = {
          for: line.meta.name,
          context: [...oldContext],
          lines: [],
        };
      } else {
        ep.lines.push(line);
      }
    } else {
      if (line.meta.type === 'episode-title') {
        ep = {
          for: line.meta.name,
          context: getBaseContext(),
          lines: [],
        };
      }
    }
  }

  // for lacking EOL
  if (ep) {
    merge(ep);
  }

  return Array.from(map.values());
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
