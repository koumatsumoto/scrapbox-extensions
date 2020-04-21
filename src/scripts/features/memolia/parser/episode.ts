import { map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { TagLine } from '../../../../libs/scrapbox/types';
import { Context, Episode, Line } from '../types';
import { makeContext } from './context';

export const isRoot = (context: Context) => {
  return context.tags[context.tags.length - 1].type === 'ideation';
};

export const makeEpisode = (of: Episode['of'], lines: Line[]) =>
  pipe(
    makeContext(lines[0] as TagLine),
    map((context: Context) => ({ of, context, lines })),
  );
