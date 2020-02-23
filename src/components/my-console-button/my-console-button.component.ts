import { openDialogAndWriteTags } from '../../scripts/tag-automation';
import { tagOptions } from '../../scripts/tag-automation/config';
import { openTagFormDialog } from '../../scripts/tag-automation/my-tag-form-dialog/my-tag-form-dialog.component';

const html = require('./my-console-button.component.html');

export class MyConsoleButton extends HTMLElement {
  static readonly elementName = 'my-console-button';

  constructor() {
    super();
    this.innerHTML = `${html}`;
  }

  connectedCallback() {
    this.addEventListener('click', this.openDialog);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.openDialog);
  }

  private async openDialog() {
    openTagFormDialog(tagOptions);

    await openDialogAndWriteTags();
  }
}
