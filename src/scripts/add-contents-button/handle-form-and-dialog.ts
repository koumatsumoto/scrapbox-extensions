import { ScrapboxApi, UserScriptApi } from 'scrapbox-tools';
import { SxDialog, SxEditWordsForm, SxLoadingIndicator } from '../../libs';
import { DynamicConfig } from '../dynamic-config';
import { makeInsertParams } from './make-insert-params/make-insert-params';

export const handleFormAndDialog = async ({ scrapboxApi, dynamicConfig }: { scrapboxApi: ScrapboxApi; dynamicConfig: DynamicConfig }) => {
  const { tags = [] } = await dynamicConfig.data;
  const form = new SxEditWordsForm({ tagOptions: tags as [] });
  const dialog = new SxDialog({ contents: form });
  const loading = new SxLoadingIndicator();
  dialog.open();

  const formResult = await form.submitResult; // wait for edit-words-form submitted
  // edit-words-form canceled
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
  await scrapboxApi.changeLine(UserScriptApi.projectName, pageTitle, makeInsertParams(formResult, new Date(), UserScriptApi.pageLines));

  if (needReloadAfterUpdation) {
    // TODO: move page without reload
    window.location.assign(`/${encodeURIComponent(UserScriptApi.projectName)}/${encodeURIComponent(pageTitle)}`);
  }

  dialog.close();
};
