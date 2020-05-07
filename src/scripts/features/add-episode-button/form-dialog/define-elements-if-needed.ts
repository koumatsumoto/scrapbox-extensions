import { SxDialogComponent } from '../../../../libs/components/dialog';
import { SxAddEpisodeFormComponent } from './form.component';

// TODO: use decorator to management customElements.define
const getDefineElementsFn = () => {
  let dialogDefined = false;
  let formDefined = false;

  return () => {
    if (!dialogDefined) {
      customElements.define(SxDialogComponent.elementName, SxDialogComponent);
      dialogDefined = true;
    }
    if (!formDefined) {
      customElements.define(SxAddEpisodeFormComponent.elementName, SxAddEpisodeFormComponent);
      formDefined = true;
    }
  };
};

export const defineElementsIfNeeded = getDefineElementsFn();
