export const scrapboxCustomFormat = {
  diaryPageTitle: /^#\d{4}-\d{2}-\d{2}$/,
};

// only for values from date getter function, e.g. date.getMonth(), date.getDate()
const zerofill = (num: number) => (`${num}`.length < 2 ? `0${num}` : `${num}`);

// NOTE: use new format `YYYY-MM-DD` since 2021.
export const getFormattedDateString = (date: Date) => `${date.getFullYear()}-${zerofill(date.getMonth() + 1)}-${zerofill(date.getDate())}`;

// NOTE: use new format `#YYYY-MM-DD` since 2021.
export const getDiaryPageTitle = (date: Date = new Date()) => `#${getFormattedDateString(date)}`;
export const isDiaryPageTitle = (title: string) => title.match(scrapboxCustomFormat.diaryPageTitle) !== null;
