// change url if want to use other image.
export const defaultImageUrl = 'https://gyazo.com/f1aff01ad67e7abbde1e6a0dffb140ed/thumb/400';
export const tagTextSelectorFn = () => Array.from(document.querySelectorAll<HTMLElement>('.page-list-item .description .page-link'));
export const listItemContentSelectorFn = () => Array.from(document.querySelectorAll<HTMLElement>('.page-list .page-list-item .content'));
export const listItemSelectorFn = () => Array.from(document.querySelectorAll<HTMLElement>('.page-list .page-list-item'));
