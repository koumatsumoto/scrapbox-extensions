import { createElement } from '../../../libs/common/dom';
import { DomManipulator } from '../../../libs/scrapbox/dom/dom-manipulator';
import { Router } from '../../../libs/scrapbox/router';
import { openDialogAndWriteTags } from '../../tag-automation';

const createAddEpisodeButton = (type: 'title-right' | 'editor-bottom') => {
  return createElement({
    tag: 'button',
    contents: 'Add Episode',
    class: ['sx-add-episode-button', `for-${type}`],
    onClick: (ev) => {
      ev.stopPropagation();
      openDialogAndWriteTags();
    },
  });
};

export const attachAddEpisodeButton = () => {
  // for title right side
  DomManipulator.getTitleLine().appendChild(createAddEpisodeButton('title-right'));

  // for page bottom
  DomManipulator.getPageContainer().appendChild(createAddEpisodeButton('editor-bottom'));
};

export const useAddEpisodeButton = () => {
  attachAddEpisodeButton(); // initial page
  Router.onPageChange(attachAddEpisodeButton);
};
