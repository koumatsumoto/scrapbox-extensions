import { isObject, tail } from 'lodash-es';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { ScrapboxClient, UserScriptApi } from 'scrapbox-tools/';

type ConfigObject = Record<string, unknown>;
const fallback: ConfigObject = {};

export class DynamicConfig {
  private data$ = new ReplaySubject<ConfigObject>(1);

  get data() {
    return firstValueFrom(this.data$);
  }

  constructor(private readonly scrapboxClient: ScrapboxClient) {
    this.loadConfig().catch();
  }

  async loadConfig() {
    try {
      const page = await this.scrapboxClient.getPage(UserScriptApi.projectName, 'config');
      const text = tail(page.lines)
        .map((line) => line.text)
        .join('');
      const config = JSON.parse(text);
      this.data$.next(isObject(config) ? (config as ConfigObject) : fallback);
    } catch (e) {
      console.error(e);
      this.data$.next({});
    }

    return this.data;
  }
}
