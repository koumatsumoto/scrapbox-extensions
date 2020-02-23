import { removeElement } from '../../../libs/common/dom';
import { TagOption } from '../config';
const html = require('./my-tag-form-dialog.component.html');
import { addWord, removeWord } from './textarea-operation';

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
  static readonly elementName = 'my-tag-form-dialog';
  private dialogElement: HTMLDialogElement;
  private checkboxesContainerElement: HTMLDivElement;
  private formElement: HTMLFormElement;
  private textareaElement: HTMLTextAreaElement;
  // this component can emit result only once.
  // after emission, component will be removed from <body> and destroyed.
  private dialogCloseResult: Promise<CustomDialogResult<string[]>>;

  constructor(tagOptions: TagOption[]) {
    super();

    this.innerHTML = `${html}`;
    this.dialogElement = this.querySelector<HTMLDialogElement>('dialog')!;
    this.formElement = this.querySelector<HTMLFormElement>('form')!;
    this.textareaElement = this.querySelector<HTMLTextAreaElement>('textarea')!;

    // construct DOM of checkboxes
    this.checkboxesContainerElement = this.querySelector<HTMLDivElement>('div.checkboxes')!;
    this.checkboxesContainerElement.innerHTML = makeCheckboxesHTML(tagOptions);
    for (const e of this.querySelectorAll<HTMLInputElement>('input[type=checkbox]')) {
      e.addEventListener('change', () => {
        if (e.checked) {
          addWord(e.value, this.textareaElement);
        } else {
          removeWord(e.value, this.textareaElement);
        }
      });
    }

    // button handling
    const cancelButton = this.querySelector<HTMLButtonElement>('button[value=cancel]')!;
    const submitButton = this.querySelector<HTMLButtonElement>('button[value=default]')!;
    this.dialogCloseResult = new Promise<CustomDialogResult<string[]>>((resolve, reject) => {
      submitButton.addEventListener(
        'click',
        () => {
          const values = this.retrieveFormValues();
          resolve({ ok: true, data: values });
          this.dialogElement.close();
          removeElement(this);
        },
        { once: true },
      );
      cancelButton.addEventListener(
        'click',
        () => {
          resolve({ ok: false });
          this.dialogElement.close();
          removeElement(this);
        },
        { once: true },
      );
    });
  }

  open() {
    this.dialogElement.showModal();

    return this.dialogCloseResult;
  }

  private retrieveFormValues() {
    const formData = new FormData(this.formElement);
    const checked = formData.getAll('tags') as string[];

    return checked.filter((str) => 0 < str.length);
  }
}
