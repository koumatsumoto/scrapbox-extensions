import { compact, map } from 'fp-ts/es6/Array';
import { pipe } from 'fp-ts/es6/pipeable';
import { addClass, findElementById } from '../../../../libs/common/dom';
import { Line, Memory } from '../types';

// id to dom starts with 'L' char because raw line-id can start with number char (it's invalid for dom)
const toDOMId = (lineId: string) => `L` + lineId;

export const colorLines = (lines: Line[], className: string[]) =>
  pipe(
    // Line object
    lines,
    // ID strings to specify dom
    map((line) => toDOMId(line.id)),
    // Elements optional
    map((id) => findElementById(id)),
    // Elements existing
    compact,
    // side-effect
    // TODO(2020-04027): use function to execute side-effect rather than map
    map((elem) => addClass(elem, className)),
  );

// for background color for each child episode block
const getNextCSSClassGen = () => {
  let idx = 0;

  return () => {
    return `sx-bgc-${idx++ % 10}`;
  };
};

export const colorChildEpisodeLines = (memory: Memory) => {
  const generator = getNextCSSClassGen();
  memory.episodes
    .filter((ep) => ep.children.length)
    .forEach((ep) => {
      // use random class
      const colorCSSClass = 'sx-child-episode-line';
      console.log('[dev] children foreach', ep.children);
      ep.children.forEach((child) => colorLines(child.lines, [colorCSSClass, generator()]));
    });
};
