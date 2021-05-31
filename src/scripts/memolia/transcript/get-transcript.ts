import { tail } from 'fp-ts/Array';
import { getOrElse } from 'fp-ts/Option';
import { Line, Memory } from '../types';

export type Transcript = {
  context: string[];
  contents: Line[];
};

const getOrEmpty = getOrElse(() => [] as Transcript['contents']);
export const getTranscript = (lineId: string, memory: Memory): Transcript => {
  for (const ep of memory.episodes) {
    for (const cep of ep.children) {
      // child-episode
      if (cep.lines[0].id === lineId) {
        const retains = tail(cep.lines);
        return {
          context: cep.context,
          contents: getOrEmpty(retains),
        };
      }
      // internal in child-episode
      for (let i = 1; i < cep.lines.length; i++) {
        if (cep.lines[i].id === lineId) {
          return {
            context: [...cep.context, cep.for],
            contents: [],
          };
        }
      }
    }

    // episode
    for (const line of ep.lines) {
      if (line.id === lineId) {
        return {
          context: ep.context,
          contents: [],
        };
      }
    }
  }

  throw new Error('No line found');
};
