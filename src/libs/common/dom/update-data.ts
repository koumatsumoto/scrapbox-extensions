const updateDataOne = <E extends HTMLElement = HTMLElement>(element: E, dataname: string, value: string) => {
  element.dataset[dataname] = value;

  return element;
};

const updateDataAll = <E extends HTMLElement = HTMLElement>(elements: E[], dataname: string, value: string) => {
  elements.forEach((e) => updateDataOne(e, dataname, value));

  return elements;
};

// to def overload
type UpdateDataFn = {
  <E extends HTMLElement>(target: E, dataname: string, value: string): E;
  <E extends HTMLElement>(target: E[], dataname: string, value: string): E[];
};

export const updateData: UpdateDataFn = <E extends Element>(target: any, dataname: string, value: string) =>
  Array.isArray(target) ? updateDataAll(target, dataname, value) : updateDataOne(target, dataname, value);
