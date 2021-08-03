import { SxLoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { SxAddEpisodeFormComponent } from './form.component';

// TODO: use decorator to management customElements.define
const getDefineElementsFn = () => {
  let formDefined = false;
  let loadingIndicatorDefined = false;

  return () => {
    if (!formDefined) {
      customElements.define(SxAddEpisodeFormComponent.elementName, SxAddEpisodeFormComponent);
      formDefined = true;
    }
    if (!loadingIndicatorDefined) {
      customElements.define(SxLoadingIndicatorComponent.elementName, SxLoadingIndicatorComponent);
      loadingIndicatorDefined = true;
    }
  };
};

export const defineElementsIfNeeded = getDefineElementsFn();
