import { documentReady } from '../../libs/common';

const cssClassName = '--us-logged-in';

// if UserScript enabled, user must be logged in
export const main = () => {
  documentReady().subscribe(() => {
    document.body.classList.add(cssClassName);
  });
};
