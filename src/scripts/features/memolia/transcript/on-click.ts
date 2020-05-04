// [data-sx-transcript-link]
const key = 'sxTranscriptLink';

const getLineId = (e: HTMLElement): string => {
  if (e.classList.contains('line') && e.id) {
    return e.id;
  } else if (e.parentElement) {
    return getLineId(e.parentElement);
  } else {
    throw new Error('Invalid Element');
  }
};

export const registerOnClick = () => {
  const links = document.querySelectorAll<HTMLAnchorElement>('.line a[rel=route]:not([type=hashTag]):not([data-sx-transcript-link])');
  links.forEach((link) => {
    link.dataset[key] = '';
    link.addEventListener('click', (e) => {
      const id = getLineId(e.target as HTMLElement);
      console.log('[dev] id', id);
    });
  });
};
