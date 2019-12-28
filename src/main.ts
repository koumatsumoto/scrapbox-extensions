/**
 * Common variables and functions (Scrapbox loads each scripts into global environment)
 */
import { enableConsoleButton, highlightTagsInListItem, useDebugBoard } from './scripts';
import { runOnDocumentReady } from './libs/common';
import { componentManager } from './scripts';

export const main = () =>
  runOnDocumentReady(() => {
    // components will be connect to DOM
    componentManager.setupComponents();

    highlightTagsInListItem();
    useDebugBoard();
    enableConsoleButton();
  });
