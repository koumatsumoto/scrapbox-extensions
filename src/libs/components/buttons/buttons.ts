import './buttons.scss';

interface Props {
  type?: '' | 'flat';
  color?: '' | 'primary';
}

/**
 * ```
 * <button is="sx-button"></button>
 * <button is="sx-button" data-type="flat" data-color="primary"></button>
 * ```
 */
export class SxButton extends HTMLButtonElement {
  constructor({ type = '', color = '' }: Props = {}) {
    super();

    this.dataset.type ||= type;
    this.dataset.color ||= color;
    this.setAttribute('is', 'sx-button');
  }
}

// register customElement once
// @see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define
try {
  customElements.define('sx-button', SxButton, { extends: 'button' });
} catch {
  // ignore for storybook reloading
}
