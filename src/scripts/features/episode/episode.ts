import { Brand } from '../../../libs/common';
import { ID } from '../../../libs/scrapbox/public-api';

// integrated-information
export type Φ<T> = (data: T) => number;

// ideation name that is bracketed in text of line e.g. [Page Name]
export type Name = Brand<string, 'Name'>;

export type Tag = {
  name: Name;
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
  // integrate
  // - length of text
  // - count of bracketed words in text
  Φ: Φ<Line>;
};

// data passes to next episode;
export type Information = {
  // parent context + ideation name at current position
  context: Context;
  // can 0
  lines: Line[];
  Φ: Φ<Link>;
};

export type Link = {
  information: Information;
  // parent episode
  from: Episode;
  // destination
  to: (ideation: Name, information: Information) => () => Promise<Episode>;
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
  name: Name;
  episodes: Episode[];
  Φ: Φ<Ideation>;
};
