import { getFormattedDateString } from './datetime';

describe('datetime-operations', () => {
  describe('getFormattedDateString', () => {
    it('should make expected string', () => {
      expect(getFormattedDateString(new Date('2019-12-31T12:30:00'))).toBe('2019-12-31');
      expect(getFormattedDateString(new Date('2019-01-01T00:00:00'))).toBe('2019-01-01');
    });
  });
});
