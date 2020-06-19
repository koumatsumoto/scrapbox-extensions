import { getGlobalScrapboxApi } from './scrapbox-api';

describe('a', () => {
  test('b', async (done) => {
    const projectId = '5dc685a50fc39d0017e27559'; // km-study
    const api = getGlobalScrapboxApi(projectId);
    setTimeout(() => {
      console.log('[dev]', api);
      done();
    }, 5000);
  });
});
