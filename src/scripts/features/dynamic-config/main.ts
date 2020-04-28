import { toError } from 'fp-ts/es6/Either';
import { left, right, chain, map, TaskEither, tryCatch, mapLeft } from 'fp-ts/es6/TaskEither';
import { Lazy } from 'fp-ts/es6/function';
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

const storageKey = '[sx/dynamic-config] config';

const isCodeBlockStartLine = (line: ApiResultPageLine) => line.text.includes('code:');
const isCodeBlockEndLine = (line: ApiResultPageLine) => line.text === '';

export const parsePageLines = (lines: ApiResultPageLine[]) => {
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

export const storeToStorage = (data: ConfigObject, w = window): TaskEither<Error, ConfigInLocalStorage> => {
  try {
    const config = {
      data,
      time: new Date().toISOString(),
    };
    w.localStorage.setItem(storageKey, JSON.stringify(config));

    return right(config);
  } catch (e) {
    return left(e);
  }
};

const fetchConfigPage: Lazy<Promise<PageResponse>> = () => new ApiClient().getPage('config');

const fromThunk = <A>(thunk: Lazy<Promise<A>>): TaskEither<Error, A> => {
  return tryCatch(thunk, toError);
};

const makeConfig = (json: string): TaskEither<Error, ConfigInLocalStorage> => {
  if (json === '') {
    return left(new Error('invalid json, check contents in config page, it can be errored if an empty line not existed'));
  }

  try {
    const config = JSON.parse(json) as ConfigInLocalStorage;

    return right(config);
  } catch (e) {
    return left(e);
  }
};

// see https://dev.to/ksaaskil/using-fp-ts-for-http-requests-and-validation-131c
export const useDynamicConfig = () =>
  pipe(
    fetchConfigPage,
    fromThunk,
    map((res) => parsePageLines(res.lines)),
    chain(makeConfig),
    chain(storeToStorage),
    // debug
    mapLeft((e) => console.error('[sx/dynamic-config]', e)),
  );
