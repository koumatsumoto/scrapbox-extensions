const addClassOne = <E extends Element = Element>(element: E, className: string) => {
  element.classList.add(className);

  return element;
};

const addClassAll = <E extends Element = Element>(elements: E[], className: string) => {
  elements.forEach((e) => addClassOne(e, className));

  return elements;
};

// to def overload
type AddClassFn = {
  <E extends Element>(target: E, className: string): E;
  <E extends Element>(target: E[], className: string): E[];
};

export const addClass: AddClassFn = <E extends Element>(target: any, className: string) =>
  Array.isArray(target) ? addClassAll(target, className) : addClassOne(target, className);
