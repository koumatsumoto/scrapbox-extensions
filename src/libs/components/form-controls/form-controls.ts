import './form-controls.scss';

const getAttributes = (elem: HTMLElement) => {
  return Object.fromEntries(elem.getAttributeNames().map((name) => [name, elem.getAttribute(name) ?? '']));
};

export class SxInput extends HTMLInputElement {
  constructor() {
    super();
  }
}

// register customElement once
// @see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define
try {
  customElements.define('sx-input', SxInput, { extends: 'input' });
} catch {
  // ignore for storybook reloading
}
