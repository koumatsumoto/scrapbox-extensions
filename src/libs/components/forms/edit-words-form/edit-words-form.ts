import { addWord, removeWord, splitIntoWords } from '../../../index';
import { makeCheckboxesContainer } from './internal';
import './edit-words-form.scss';

// null if edit-words-form canceled
type FormResult = string[] | null;

export class SxEditWordsForm extends HTMLElement {
  // whether edit-words-form submitted or canceled
  private readonly _submitResult: Promise<FormResult>;

  get submitResult() {
    return this._submitResult;
  }

  constructor({ tagOptions = [] }: { tagOptions?: { name: string; type: string }[] } = {}) {
    super();

    this.innerHTML = `
      <form>
        <div class="checkbox-container">${makeCheckboxesContainer(tagOptions)}</div>
        <div><input is="sx-input" name="tagInput" type="text" /></div>
        <footer>
          <button is="sx-button" value="cancel">Cancel</button>
          <button is="sx-button" data-color="primary" value="default" autofocus>Add</button>
        </footer>
      </form>
    `;

    const textInput = this.querySelector<HTMLInputElement>('input[type=text]')!;
    const checkboxes = Array.from(this.querySelectorAll<HTMLInputElement>('input[type=checkbox]'));
    const cancelButton = this.querySelector<HTMLButtonElement>('button[value=cancel]')!;
    const submitButton = this.querySelector<HTMLButtonElement>('button[value=default]')!;

    // edit textarea on checkbox change
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        textInput.value = checkbox.checked ? addWord(textInput.value, checkbox.value) + ' ' : removeWord(textInput.value, checkbox.value);
      });
    });

    // handle button actions
    this._submitResult = new Promise<FormResult>((resolve) => {
      submitButton.addEventListener(
        'click',
        (ev) => {
          ev.preventDefault();
          resolve(splitIntoWords(textInput.value));
        },
        { once: true },
      );
      cancelButton.addEventListener(
        'click',
        (ev) => {
          ev.preventDefault();
          resolve(null);
        },
        { once: true },
      );
    });
  }
}

// register customElement once
// @see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define
try {
  customElements.define('sx-edit-words-form', SxEditWordsForm);
} catch {
  // ignore for storybook reloading
}
