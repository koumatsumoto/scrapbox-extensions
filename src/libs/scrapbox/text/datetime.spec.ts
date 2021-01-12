import { getDiaryPageTitle, getFormattedDateString, isDiaryPageTitle, scrapboxCustomFormat } from './datetime';

describe('datetime-operations', () => {
  describe('getFormattedDateString', () => {
    it('should make expected string', () => {
      expect(getFormattedDateString(new Date('2019-12-31T12:30:00'))).toBe('2019-12-31');
      expect(getFormattedDateString(new Date('2019-01-01T00:00:00'))).toBe('2019-01-01');
    });
  });

  describe('getDiaryPageTitle', () => {
    it('should get string', () => {
      expect(getDiaryPageTitle()).toMatch(scrapboxCustomFormat.diaryPageTitle);
    });
  });

  describe('isDiaryPageTitle', () => {
    it('should work', () => {
      expect(isDiaryPageTitle('2020-02-09')).toBe(true);
      expect(isDiaryPageTitle('a2020-02-28')).toBe(false);
      expect(isDiaryPageTitle('2020-02-09a')).toBe(false);
      expect(isDiaryPageTitle('else')).toBe(false);
    });
  });
});
