import { runOnDocumentReady } from '../../libs/common';

const cssClassName = '--us-logged-in';

// if UserScript enabled, user must be logged in
export const main = () => {
  runOnDocumentReady(() => {
    document.body.classList.add(cssClassName);
  });
};
