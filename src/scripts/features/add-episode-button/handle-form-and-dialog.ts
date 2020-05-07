import { SxDialogComponent } from '../../../libs/components/dialog';
import { getApiManager } from '../../../libs/scrapbox/private-api';
import { getFirstLineOrFail, isEmptyPage, isTitleOnlyPage, loadPage } from '../../../libs/scrapbox/public-api';
import { defineElementsIfNeeded } from './form-dialog/define-elements-if-needed';
import { SxAddEpisodeFormComponent } from './form-dialog/form.component';
import { getConfigOrFail } from './form-dialog/get-config-or-fail';
import { makeInsertParams } from './make-insert-params/make-insert-params';

export const handleFormAndDialog = async () => {
  defineElementsIfNeeded();
  const tags = await getConfigOrFail();
  const api = await getApiManager();
  const dialog = new SxDialogComponent();
  const form = new SxAddEpisodeFormComponent(tags);

  dialog.setContent(form);
  dialog.open();

  const formResult = await form.result; // wait for form submitted
  // form canceled
  if (formResult === null) {
    dialog.close();
    return;
  }

  // FIXME: scrapbox editor can not receive line changes if title-only page.
  const needReloadAfterUpdation = isEmptyPage() || isTitleOnlyPage();

  // dialog.showLoadingIndicator();
  await api.changeLineOfCurrentPage(makeInsertParams(formResult));

  const titleLine = getFirstLineOrFail();
  const title = titleLine.text;

  if (needReloadAfterUpdation) {
    loadPage(title);
  }

  dialog.close();
};
