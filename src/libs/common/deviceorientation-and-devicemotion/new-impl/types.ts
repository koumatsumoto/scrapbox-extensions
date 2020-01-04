export type CommandTypes =
  | 'tip'
  | 'double tip'
  | 'shake'
  | 'double shake'
  | 'nothing'
  | 'waiting'
  | 'tip expecting next'
  | 'shake expecting next';

export type ActionTypes = 'tap' | 'double tap' | 'none' | 'checking double tap' | 'waiting';
