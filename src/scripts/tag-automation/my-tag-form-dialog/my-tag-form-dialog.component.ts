import { TagOption } from '../config';

const html = require('./my-tag-form-dialog.component.html');

export class MyTagFormDialog extends HTMLElement {
  static readonly elementName = 'my-tag-form-dialog';
  private dialogElement: HTMLDialogElement;
  private checkboxesContainerElement: HTMLDivElement;
  // for checkbox id
  private labelId = 0;

  constructor(tagOptions: TagOption[]) {
    super();
    this.innerHTML = `${html}`;
    this.dialogElement = this.querySelector<HTMLDialogElement>('dialog')!;
    this.checkboxesContainerElement = this.querySelector<HTMLDivElement>('div.checkboxes')!;
    this.makeContents(tagOptions);
  }

  showModal() {
    this.dialogElement.showModal();
  }

  private makeCheckboxesHTML(tagOptions: TagOption[]) {
    return tagOptions
      .map((group) => {
        const inputs = group
          .map((obj) => {
            const id = `usd-${this.labelId++}`;
            const value = obj.value;

            return `<input id="${id}" type="checkbox" name="tags" value="${value}"><label for="${id}">${value}</label>`;
          })
          .join('');

        return `<div class="tag-group">${inputs}</div>`;
      })
      .join('');
  }

  private makeContents(tagOptions: TagOption[]) {
    this.checkboxesContainerElement.innerHTML = this.makeCheckboxesHTML(tagOptions);
  }
}

const isDefined = false;
export const openTagFormDialog = (tagOptions: TagOption[]) => {
  if (!isDefined) {
    customElements.define(MyTagFormDialog.elementName, MyTagFormDialog);
  }

  const dialog = new MyTagFormDialog(tagOptions);
  document.body.appendChild(dialog);
  dialog.showModal();
};
