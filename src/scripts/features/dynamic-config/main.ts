import { pipe } from 'fp-ts/es6/pipeable';
import { ApiClient } from '../../../libs/scrapbox/private-api/api-client/api-client';
import { ApiResultPageLine, PageResponse } from '../../../libs/scrapbox/private-api/api-client/api-client-types';
import { map, tryCatch } from 'fp-ts/es6/TaskEither';
import { tryCatch as tc } from 'fp-ts/es6/Either';
import { toError } from 'fp-ts/es6/Either';
import { Lazy } from 'fp-ts/es6/function';

type ConfigObject = {
  // 2020-04-28
  // TODO: not implemented
};

type ConfigInLocalStorage = {
  data: ConfigObject;
  time: string; // Date.
};

const errors = {
  pageNotFound: '[sx/dynamic-config] error to request config page, create /config page to use this feature.',
  pageNotContainingCodeBlock: '[sx/dynamic-config] page not containing line that text including "code:".',
  invalidPageContents: '[sx/dynamic-config] invalid json, check contents in config page, it can be errored if an empty line not existed.',
};

const storageKey = '[sx/dynamic-config] config';

const isCodeBlockStartLine = (line: ApiResultPageLine) => line.text.includes('code:');
const isCodeBlockEndLine = (line: ApiResultPageLine) => line.text === '';

export const constructCodeStringsOrEmptyStrings = (lines: ApiResultPageLine[]) => {
  // code:filename.json
  let codeBlockHeadLineFound = false;
  let totalCodeStrings = '';
  for (const line of lines) {
    switch (true) {
      // from first-line to first code-block found
      case !codeBlockHeadLineFound && isCodeBlockStartLine(line): {
        codeBlockHeadLineFound = true;
        break;
      }
      // from next of code-block found to before of code-block end
      case codeBlockHeadLineFound && !isCodeBlockEndLine(line): {
        totalCodeStrings += line.text + '\n';
        break;
      }
      case codeBlockHeadLineFound && isCodeBlockEndLine(line): {
        return totalCodeStrings;
      }
    }
  }

  return totalCodeStrings;
};

export const constructConfig = (json: string) => {
  if (json === '') {
    throw new Error(errors.invalidPageContents + json);
  }

  const config = JSON.parse(json) as ConfigInLocalStorage;
  // TODO: validate config object here

  return config;
};

export const storeToStorage = (data: ConfigObject, w = window) => {
  w.localStorage.setItem(
    storageKey,
    JSON.stringify({
      data,
      time: new Date().toISOString(),
    }),
  );
};

export const useDynamicConfig = async () =>
  pipe(
    () => new ApiClient().getPage('config'),
    (task: Lazy<Promise<PageResponse>>) => tryCatch(task, toError),
    map((res: PageResponse) => res.lines),
    map(constructCodeStringsOrEmptyStrings),
    map(constructConfig),
    (task) => tryCatch(task, toError),
  );
