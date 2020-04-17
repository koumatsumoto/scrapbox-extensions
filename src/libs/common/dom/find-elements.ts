import { fromNullable } from 'fp-ts/es6/Option';

export const findElementOrFail = <T extends Element>(selector: string, parent: ParentNode = document) => {
  const elem = parent.querySelector<T>(selector);
  if (!elem) {
    throw new Error('Element not found');
  }

  return elem;
};

export const findElement = <E extends Element = Element>(selector: string, parent: ParentNode = document) =>
  fromNullable(parent.querySelector<E>(selector));

export const findElements = <T extends Element>(selector: string, parent: ParentNode = document) =>
  Array.from(parent.querySelectorAll<T>(selector));
