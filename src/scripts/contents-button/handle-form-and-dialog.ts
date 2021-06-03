import { SxDialogComponent } from '../../libs/components/dialog';
import { ScrapboxScriptApi } from '../../libs/scrapbox';
import { getGlobalHelpers } from '../global-helpers';
import { defineElementsIfNeeded } from './form/define-elements-if-needed';
import { SxAddEpisodeFormComponent } from './form/form.component';
import { getConfigOrFail } from './form/get-config-or-fail';
import { SxLoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { makeInsertParams } from './make-insert-params/make-insert-params';

export const handleFormAndDialog = async () => {
  defineElementsIfNeeded();
  const { scrapboxClient } = getGlobalHelpers();

  const tags = await getConfigOrFail();
  const dialog = new SxDialogComponent();
  const form = new SxAddEpisodeFormComponent(tags);
  const loading = new SxLoadingIndicatorComponent();

  dialog.setContent(form);
  dialog.open();

  const formResult = await form.result; // wait for form submitted
  // form canceled
  if (formResult === null) {
    dialog.close();
    return;
  }

  // FIXME: scrapbox editor can not receive line changes if title-only page.
  const needReloadAfterUpdation = ScrapboxScriptApi.pageLines.length === 1;

  // show loading indicator while api request
  dialog.setContent(loading);
  const pageTitle = ScrapboxScriptApi.pageTitle;
  if (!pageTitle) {
    throw new Error('Page name not found');
  }
  await scrapboxClient.changeLine(
    ScrapboxScriptApi.projectName,
    pageTitle,
    makeInsertParams(formResult, new Date(), ScrapboxScriptApi.pageLines),
  );

  if (needReloadAfterUpdation) {
    // TODO: move page without reload
    window.location.assign(`/${encodeURIComponent(ScrapboxScriptApi.projectName)}/${encodeURIComponent(pageTitle)}`);
  }

  dialog.close();
};
