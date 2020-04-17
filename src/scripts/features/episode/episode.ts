import { Brand } from '../../../libs/common';
import { ID } from '../../../libs/scrapbox/public-api';

// integrated-information
export type Φ<T> = (data: T) => number;

// ideation name that is bracketed in text of line e.g. [Page Name]
export type Word = Brand<string, 'Word'>;

export type Tag = {
  word: Word;
  type: 'date' | 'time' | 'feeling' | 'activity' | 'ideation';
  // differentiate by type
  Φ: Φ<Tag>;
};

export type Context = {
  tags: Tag[];
  // integrate tags
  Φ: Φ<Context>;
};

// made from Line
export type Line = {
  id: ID;
  text: string;
  words: Word[];
  // integrate
  // - length of text
  // - count of bracketed words in text
  Φ: Φ<Line>;
};

export type Link = {
  // parent episode
  from: Episode;
  // destination
  to: Episode;
  // data passes to next episode;
  information: {
    // parent context + ideation name at current position
    context: Context;
    // can 0
    lines: Line[];
    Φ: Φ<Link>;
  };
};

export type Episode = {
  // where episode belongs to
  of: Ideation;
  // have an array of tag
  context: Context;
  // all lines in episode block
  lines: Line[];
  // null if root-episode
  parent: Link | null;
  // all references to linked to episode
  children: Link[];
  Φ: Φ<Episode>;
};

// construct from scrapbox.Page
// the node of episodes
export type Ideation = {
  name: string;
  episodes: Episode[];
  Φ: Φ<Ideation>;
};
