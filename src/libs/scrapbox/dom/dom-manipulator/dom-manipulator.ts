import { findElement, getElementOrFail } from '../../../common/dom';

const getAppRoot = () => getElementOrFail('#app-container');

// alias for breaking change for scrapbox.io
type LineElement = HTMLDivElement;

/**
 * Encapsulate scrapbox dom specification and provide method as natural language
 */
export class DomManipulator {
  static getTitleLine() {
    return findElement<LineElement>('.page .lines .line-title', getAppRoot());
  }
}
