import { removeElement } from '../../common/dom';

export class SxDialog extends HTMLElement {
  static elementName = 'sx-dialog';
  private readonly dialog: HTMLDialogElement;

  constructor() {
    super();

    this.innerHTML = '<dialog></dialog>';
    this.dialog = this.querySelector<HTMLDialogElement>('dialog')!;

    // also used by closing with ESC key
    this.dialog.addEventListener('close', () => removeElement(this), { once: true });
  }

  open() {
    if (this.parentNode === null) {
      document.body.appendChild(this);
    }

    this.dialog.showModal();
  }

  close() {
    this.dialog.close();
  }

  setContent(element: HTMLElement) {
    this.dialog.innerHTML = ''; // reset
    this.dialog.appendChild(element);
  }
}
