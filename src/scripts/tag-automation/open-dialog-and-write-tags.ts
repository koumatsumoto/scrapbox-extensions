import { getDateText, getPrivateApi, isEmptyPage, isTitleOnlyPage, loadPage } from '../../libs/scrapbox';
import { tagOptions } from './config';
import { openDialog } from './dialog';
import { createLineInsertions } from './internal/create-line-insertions';
import { openTagFormDialog } from './my-tag-form-dialog/my-tag-form-dialog.component';

export const openDialogAndWriteTags = async () => {
  openTagFormDialog(tagOptions);

  return;

  try {
    const [api, result] = await Promise.all([getPrivateApi(), openDialog({ tagOptions })]);

    if (result.ok) {
      // TODO: bad impl, real title is create in createLineInsertions(), this title is possible to mistake.
      const title = getDateText();
      // FIXME: scrapbox editor can not receive line changes if title-only page.
      const needReload = isEmptyPage() || isTitleOnlyPage();

      await api.changeLine(createLineInsertions(result.data));

      if (needReload) {
        loadPage(title);
      }
    }
  } catch (e) {
    alert(e);
  }
};
