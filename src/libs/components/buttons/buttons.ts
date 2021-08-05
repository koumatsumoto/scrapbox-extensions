import './buttons.scss';

/**
 * <sx-button></sx-button>
 */
export class SxButton extends HTMLButtonElement {
  constructor() {
    super();
  }
}

// register customElement once
// @see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define
try {
  customElements.define('sx-button', SxButton, { extends: 'button' });
} catch {
  // ignore for storybook reloading
}
