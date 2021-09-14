import { removeElement } from '../../common';
import './dialog.scss';

export interface DialogOptions {
  contents: HTMLElement;
  onClose?: () => unknown;
  closeTrigger?: string;
}

// from ts@4.4.3
export interface HTMLDialogElement extends HTMLElement {
  open: boolean;
  showModal(): void;
  close(): void;
}

const defaultOptions = {
  closeTrigger: 'data-close-dialog',
  onClose: () => {
    /* noop */
  },
};

export class SxDialog extends HTMLElement {
  static elementName = 'sx-dialog';
  private readonly options: Required<DialogOptions>;
  private readonly dialog: HTMLDialogElement;

  constructor(options: DialogOptions) {
    super();

    this.options = { ...options, ...defaultOptions };

    this.dialog = document.createElement('dialog') as HTMLDialogElement;
    this.dialog.addEventListener('close', () => removeElement(this), { once: true }); // NOTE: support ESC key

    const closeTriggerElement = this.options.contents.querySelector(`[${this.options.closeTrigger}]`);
    closeTriggerElement?.addEventListener('click', () => this.close(), { once: true });

    this.dialog.appendChild(options.contents);
    this.appendChild(this.dialog);
  }

  open() {
    if (this.dialog.open) {
      return;
    }

    if (this.parentNode === null) {
      document.body.appendChild(this);
    }

    this.dialog.showModal();
  }

  close() {
    if (this.dialog.open) {
      this.options.onClose();
      this.dialog.close();
    }
  }

  setContent(element: HTMLElement) {
    this.dialog.innerHTML = ''; // reset
    this.dialog.appendChild(element);
  }
}

// register customElement once
// @see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define
try {
  customElements.define(SxDialog.elementName, SxDialog);
} catch {
  // ignore for storybook reloading
}
