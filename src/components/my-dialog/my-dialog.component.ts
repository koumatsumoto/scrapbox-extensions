const html = require('./my-dialog.component.html');

export class MyDialog extends HTMLElement {
  static readonly elementName = 'my-dialog';
  private dialogElement: HTMLDialogElement | null = null;

  constructor() {
    super();
    this.innerHTML = `${html}`;
    this.dialogElement = this.querySelector('dialog')!;
  }
}
