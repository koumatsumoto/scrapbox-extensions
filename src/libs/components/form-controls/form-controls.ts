import './form-controls.scss';

const getAttributes = (elem: HTMLElement) => {
  return Object.fromEntries(elem.getAttributeNames().map((name) => [name, elem.getAttribute(name) ?? '']));
};

export class SxInput extends HTMLInputElement {
  constructor() {
    super();
  }
}

export class SxCheckbox extends HTMLInputElement {
  constructor(props: { name?: string; value?: string; label?: string; checked?: boolean }) {
    super();

    this.name = props?.name ?? this.getAttribute('name') ?? '';
    this.value = props?.value ?? this.getAttribute('value') ?? '';
    this.checked = props?.checked || this.getAttribute('checked') !== null;
    this.dataset.label = props?.label ?? this.getAttribute('label') ?? '';
  }
}

// register customElement once
// @see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define
try {
  customElements.define('sx-input', SxInput, { extends: 'input' });
  customElements.define('sx-checkbox', SxCheckbox, { extends: 'input' });
} catch {
  // ignore for storybook reloading
}
