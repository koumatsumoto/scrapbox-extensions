export const getElementOrFail = <T extends Element>(selector: string) => {
  const elem = document.querySelector(selector);
  if (!elem) {
    throw new Error('Element not found');
  }

  return elem as T;
};

export const getElements = (selector: string) => Array.from(document.querySelectorAll(selector)) as Element[];
