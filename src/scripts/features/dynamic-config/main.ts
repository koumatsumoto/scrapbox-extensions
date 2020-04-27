import { chain, Either, fromPredicate, left, map, parseJSON, right, tryCatch } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { ApiClient } from '../../../libs/scrapbox/private-api/api-client/api-client';
import { ApiResultPageLine, PageResponse } from '../../../libs/scrapbox/private-api/api-client/api-client-types';

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

export const fetchConfigPage = async (): Promise<Either<Error, PageResponse>> => {
  try {
    const api = new ApiClient();
    return right(await api.getPage('config'));
  } catch (e) {
    return left(new Error(errors.pageNotFound));
  }
};

const isCodeBlockStartLine = (line: ApiResultPageLine) => line.text.includes('code:');
const isCodeBlockEndLine = (line: ApiResultPageLine) => line.text === '';

export const constructCodeStringsOrEmptyStrings = (lines: ApiResultPageLine[]) => {
  // code:filename.json
  let codeBlockHeadLineFound = true;
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

export const storeToStorage = (data: ConfigObject, w = window) =>
  tryCatch(
    () => {
      w.localStorage.setItem(
        storageKey,
        JSON.stringify({
          data,
          time: new Date().toISOString(),
        }),
      );
    },
    (e) => e,
  );

export const useDynamicConfig = async () =>
  pipe(
    await fetchConfigPage(),
    chain((v) => v),
    map((response) => constructCodeStringsOrEmptyStrings(response.lines)),
    fromPredicate(
      (json) => json !== '',
      (json) => new Error(errors.pageNotContainingCodeBlock + json),
    ),
    chain((json) => parseJSON<ConfigObject>(json, (e) => new Error(errors.invalidPageContents + e))),
    chain((obj) => storeToStorage(obj)),
  );
