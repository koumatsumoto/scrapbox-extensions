import { compact, map } from 'fp-ts/es6/Array';
import { pipe } from 'fp-ts/es6/pipeable';
import { addClass, findElementById } from '../../../../libs/common/dom';
import { Line, Memory } from '../types';

export const colorLines = (lines: Line[], className: string) =>
  pipe(
    lines,
    // to elements that exists
    map((line) => findElementById(line.id)),
    compact,
    // side-effect
    // TODO(2020-04027): use function to execute side-effect rather than map
    map((elem) => addClass(elem, className)),
  );

export const colorChildEpisodeLines = (memory: Memory) => {
  memory.episodes
    .filter((ep) => ep.children.length)
    .forEach((ep) => {
      // use random class
      const colorCSSClass = 'sx-child-episode-line';
      ep.children.forEach((child) => colorLines(child.lines, colorCSSClass));
    });
};
