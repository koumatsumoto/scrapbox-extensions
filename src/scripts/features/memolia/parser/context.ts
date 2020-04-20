import { Either, map } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { TagLine } from '../../../../libs/scrapbox/types';
import { Context, Tag } from '../types';
import { parseTagLine } from './tag';

export const makeContext = (line: TagLine): Either<Error, Context> =>
  pipe(
    parseTagLine(line),
    map((tags: Tag[]) => ({ tags })),
  );
