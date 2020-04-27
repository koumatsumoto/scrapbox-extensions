import { filter, Option, tryCatch } from 'fp-ts/es6/Option';
import { pipe } from 'fp-ts/es6/pipeable';

export const findElementOrFail = <T extends Element>(selector: string, parent: ParentNode = document) => {
  const elem = parent.querySelector<T>(selector);
  if (!elem) {
    throw new Error('Element not found');
  }

  return elem;
};

type IsElement = <E>(e: E | null) => e is E;

export const findElement = <E extends Element = Element>(selector: string, parent: ParentNode = document) =>
  pipe(
    // NOTE: if id that starts with number used, error occurs
    // @see https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
    tryCatch(() => parent.querySelector<E>(selector)),
    filter(((e: E | null) => !!e) as IsElement),
  );

export const findElementById = <E extends HTMLElement = HTMLElement>(id: string): Option<E> =>
  pipe(
    tryCatch(() => document.getElementById(id) as E),
    filter(((e: E | null) => !!e) as IsElement),
  );

export const findElements = <T extends Element>(selector: string, parent: ParentNode = document) =>
  Array.from(parent.querySelectorAll<T>(selector));
