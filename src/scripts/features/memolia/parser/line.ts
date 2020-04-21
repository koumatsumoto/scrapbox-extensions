import { Line } from '../types';

type PageTitleLineMetadata = {
  type: 'page-title';
  name?: never;
  indent: 0;
};
type EpisodeTitleLineMetadata = {
  type: 'episode-title';
  name: string;
  indent: number;
};
type WithInlineLinksLineMetadata = {
  type: 'with-inline-links';
  name: string[];
  indent: number;
};
type EmptyLineMetadata = {
  type: 'empty';
  name?: never;
  indent: number;
};
type SimpleTextLineMetadata = {
  type: 'simple-text';
  name?: never;
  indent: number;
};

export type LineMetadata =
  | PageTitleLineMetadata
  | EpisodeTitleLineMetadata
  | WithInlineLinksLineMetadata
  | EmptyLineMetadata
  | SimpleTextLineMetadata;

const isLinkableLine = (v: LineMetadata): v is EpisodeTitleLineMetadata | WithInlineLinksLineMetadata => {
  return v.type === 'episode-title' || v.type === 'with-inline-links';
};

export const getLineMetadata = (nodes: Line['nodes']): LineMetadata => {
  // title-line
  if (nodes == null) {
    return {
      type: 'page-title',
      indent: 0,
    };
  }

  // empty-line
  if (nodes === '') {
    return {
      type: 'empty',
      indent: 0,
    };
  }

  // non-indented simple-text-line
  if (typeof nodes === 'string') {
    return {
      type: 'simple-text',
      indent: 0,
    };
  }

  // non-indented line can have array nodes
  // "links [a] and [b]" => ["links ", {}, " and ", {}]
  if (Array.isArray(nodes)) {
    const inners = nodes.map((node) => getLineMetadata(node)).filter(isLinkableLine);
    return {
      type: 'with-inline-links',
      name: inners.flatMap((i) => i.name),
      indent: 0,
    };
  }

  // non-indented link-only-line e.g. "[link only]"
  if (nodes.type === 'link') {
    return {
      type: 'episode-title',
      name: nodes.unit.page,
      indent: 0,
    };
  }

  // indented line
  if (nodes.type === 'indent') {
    const inner = getLineMetadata(nodes.children) as Exclude<LineMetadata, PageTitleLineMetadata>;
    if (inner) {
      return {
        ...inner,
        indent: nodes.unit.tag.length,
      };
    }
  }

  console.error(nodes);
  throw new Error('Bad Implements: unreachable code');
};

export type LineWithMetadata = Line & { meta: LineMetadata };
export const makeLineWithMetadata = (line: Line): LineWithMetadata => ({ ...line, mata: getLineMetadata(line) });
