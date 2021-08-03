import { UserScriptApi } from 'scrapbox-tools/user-script-api';
import { SxDialog } from '../../libs/components/dialog';
import { SxLoadingIndicator } from '../../libs/components/loading-indicator/loading-indicator';
import { getGlobalHelpers } from '../global-helpers';
import { defineElementsIfNeeded } from './form/define-elements-if-needed';
import { SxAddEpisodeFormComponent } from './form/form.component';
import { getConfigOrFail } from './form/get-config-or-fail';
import { makeInsertParams } from './make-insert-params/make-insert-params';

export const handleFormAndDialog = async () => {
  defineElementsIfNeeded();
  const { scrapboxClient } = getGlobalHelpers();

  const tags = await getConfigOrFail();
  const form = new SxAddEpisodeFormComponent(tags);
  const dialog = new SxDialog({ contents: form });
  const loading = new SxLoadingIndicator();
  dialog.open();

  const formResult = await form.result; // wait for form submitted
  // form canceled
  if (formResult === null) {
    dialog.close();
    return;
  }

  // FIXME: scrapbox editor can not receive line changes if title-only page.
  const needReloadAfterUpdation = UserScriptApi.pageLines.length === 1;

  // show loading indicator while api request
  dialog.setContent(loading);
  const pageTitle = UserScriptApi.pageTitle;
  if (!pageTitle) {
    throw new Error('Page name not found');
  }
  await scrapboxClient.changeLine(UserScriptApi.projectName, pageTitle, makeInsertParams(formResult, new Date(), UserScriptApi.pageLines));

  if (needReloadAfterUpdation) {
    // TODO: move page without reload
    window.location.assign(`/${encodeURIComponent(UserScriptApi.projectName)}/${encodeURIComponent(pageTitle)}`);
  }

  dialog.close();
};
