import { Line } from 'scrapbox-tools/user-script-api';
import { Memory, Name } from '../types';

export type TitleBlock = {
  of: Memory['name'];
  lines: [Line];
};

export type SemantemeBlock = {
  of: Memory['name'];
  lines: Line[];
};

export type EpisodeBlock = {
  of: Memory['name'];
  lines: Line[];
};

export type BlockParseResult = {
  title: TitleBlock;
  semanteme: SemantemeBlock | null;
  episodes: EpisodeBlock[];
};

export const isTagLine = (line: Line) => line.text.startsWith('#');

// scrapbox.Page.lines.map((l) => ({ n: l.section.number, t: l.text }))
export const parseToBlock = (lines: Line[]): BlockParseResult => {
  // iteration point
  let cursor = 0;
  // head is title-line
  const titleLine = lines[cursor];
  const getSemantemeBlock = (): SemantemeBlock => ({ of: titleLine.text as Name, lines: [] });
  const getEpisodeBlock = (first: Line): EpisodeBlock => ({ of: titleLine.text as Name, lines: [first] });

  // title block
  const titleBlock: TitleBlock = {
    of: titleLine.text as Name,
    lines: [titleLine],
  };
  // case: page has only title-line
  if (cursor === lines.length) {
    return {
      title: titleBlock,
      semanteme: null,
      episodes: [],
    };
  }

  // semanteme block
  const semantemeBlock = getSemantemeBlock();
  for (cursor = 1; cursor < lines.length; cursor++) {
    const line = lines[cursor];
    if (isTagLine(line)) {
      break;
    } else {
      semantemeBlock.lines.push(line);
    }
  }
  // case: page not have episodes
  if (cursor === lines.length) {
    return {
      title: titleBlock,
      semanteme: semantemeBlock,
      episodes: [],
    };
  }

  // construct episode-block
  // first line is specified as tag-line above
  let block = getEpisodeBlock(lines[cursor]);
  const blocks: EpisodeBlock[] = [];
  for (cursor++; cursor < lines.length; cursor++) {
    const line = lines[cursor];
    if (isTagLine(line)) {
      blocks.push(block);
      block = getEpisodeBlock(line);
    } else {
      block.lines.push(line);
    }
  }

  blocks.push(block);

  return {
    title: titleBlock,
    semanteme: semantemeBlock,
    episodes: blocks,
  };
};
