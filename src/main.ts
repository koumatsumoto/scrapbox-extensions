/**
 * Common variables and functions (Scrapbox loads each scripts into global environment)
 */
import { enableConsoleButton, highlightTagsInListItem, useDebugBoard } from './scripts';
import { defineCustomElements } from './components';
import { runOnDocumentReady } from './libs/common';

export const main = () =>
  runOnDocumentReady(() => {
    // define and construct custom elements
    defineCustomElements();

    highlightTagsInListItem();
    useDebugBoard();
    enableConsoleButton();
  });
