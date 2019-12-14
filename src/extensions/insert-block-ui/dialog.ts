// use for mutex
import { removeElement } from '../../util/common';

const dialogId = 'dialog-for-user-script';
const inputName = 'checkedTags';

const makeCheckboxesHTML = (values: string[]) =>
  values.map((v) => `<label>${v}<input type="checkbox" name="${inputName}" value="${v}"></label>`).join('');

const menuHTML = `<menu><button value="cancel">Cancel</button><button value="default">Copy</button></menu>`;

const makeFormHTML = (checkboxesHTML: string, menuHTML: string) =>
  `<form method="dialog"><div>${checkboxesHTML}</div><menu>${menuHTML}</menu></form>`;

export const makeDialogInnerHTML = (checkboxValues: string[]) => makeFormHTML(makeCheckboxesHTML(checkboxValues), menuHTML);

const isDialogExist = () => document.querySelector(`#${dialogId}`);

export const appendDialogToDOMOrFail = (checkboxValues: string[]) => {
  if (isDialogExist()) {
    throw new Error('dialog already exists');
  }

  const dialog = document.createElement('DIALOG') as HTMLDialogElement;
  dialog.id = dialogId;
  dialog.innerHTML = makeDialogInnerHTML(checkboxValues);
  document.body.appendChild(dialog);

  return dialog;
};

export const retrieveFormValues = (dialog: HTMLDialogElement) => {
  const form = dialog.querySelector<HTMLFormElement>('form');
  if (!form) {
    throw new Error('Unexpected Error, form element must be the dialog created by user script');
  }
  const formData = new FormData(form);

  const checked = formData.getAll(inputName) as string[];

  return checked.filter((str) => 0 < str.length);
};

export const openDialog = async (param: { tagOptions: string[] }) =>
  new Promise<string[]>((resolve, reject) => {
    try {
      const dialog = appendDialogToDOMOrFail(param.tagOptions);
      const resultHandler = () => {
        dialog.removeEventListener('close', resultHandler);
        try {
          removeElement(dialog);
          const tags = retrieveFormValues(dialog);
          resolve(tags);
        } catch (e) {
          reject(e);
        }
      };

      dialog.addEventListener('close', resultHandler);
      dialog.showModal();
    } catch (e) {
      reject(e);
    }
  });
