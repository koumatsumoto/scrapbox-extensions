import { removeElement } from '../../../../libs/common/dom';
import { TagOption } from '../config';
const html = require('./form-dialog.component.html');
import { addWord, removeWord, splitWords } from './textarea-operation';

type CustomDialogResult<T> = { ok: false } | { ok: true; data: T };

const makeCheckboxesHTML = (tagOptions: TagOption[]) => {
  let labelId = 0;

  return tagOptions
    .map((group) => {
      const inputs = group
        .map((obj) => {
          const id = `tag-${labelId++}`;
          const value = obj.value;

          return `<input id="${id}" type="checkbox" name="tags" value="${value}"><label for="${id}">${value}</label>`;
        })
        .join('');

      return `<div class="tag-group">${inputs}</div>`;
    })
    .join('');
};

export class MyTagFormDialog extends HTMLElement {
  // whether form submitted or canceled
  readonly result: Promise<CustomDialogResult<string[]>>;

  static readonly elementName = 'my-tag-form-dialog';
  private dialogElement: HTMLDialogElement;
  private checkboxesContainerElement: HTMLDivElement;
  private inputTextElement: HTMLInputElement;

  constructor(tagOptions: TagOption[]) {
    super();

    this.innerHTML = `${html}`;
    this.dialogElement = this.querySelector<HTMLDialogElement>('dialog')!;
    this.inputTextElement = this.querySelector<HTMLInputElement>('input[type=text]')!;

    // construct DOM of checkboxes
    this.checkboxesContainerElement = this.querySelector<HTMLDivElement>('#checkboxContainer')!;
    this.checkboxesContainerElement.innerHTML = makeCheckboxesHTML(tagOptions);
    for (const e of this.querySelectorAll<HTMLInputElement>('input[type=checkbox]')) {
      e.addEventListener('change', () => {
        if (e.checked) {
          addWord(e.value, this.inputTextElement);
          this.inputTextElement.value = this.inputTextElement.value + ' ';
        } else {
          removeWord(e.value, this.inputTextElement);
        }
      });
    }

    // button handling
    const cancelButton = this.querySelector<HTMLButtonElement>('button[value=cancel]')!;
    const submitButton = this.querySelector<HTMLButtonElement>('button[value=default]')!;
    this.result = new Promise<CustomDialogResult<string[]>>((resolve) => {
      submitButton.addEventListener('click', () => resolve({ ok: true, data: splitWords(this.inputTextElement.value) }), { once: true });
      cancelButton.addEventListener('click', () => resolve({ ok: false }), { once: true });
    });
  }

  open() {
    this.dialogElement.showModal();

    return this.result;
  }

  close() {
    this.dialogElement.close();
    removeElement(this);
  }
}
