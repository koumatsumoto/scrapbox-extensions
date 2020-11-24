import { toError } from 'fp-ts/es6/Either';
import { chain, fold, left, map, right, TaskEither, tryCatch } from 'fp-ts/es6/TaskEither';
import { Lazy } from 'fp-ts/es6/function';
import { pipe } from 'fp-ts/es6/pipeable';
import { Page } from 'scrapbox-tools/scrapbox-client';
import { DynamicConfig } from '../../config';
import { getGlobalHelpers } from '../../global-helpers';

export const storageKey = '[sx/dynamic-config] config';
type Line = {
  text: string;
};

const isCodeBlockStartLine = (line: Line) => line.text.includes('code:');
const isCodeBlockEndLine = (line: Line) => line.text === '';

export const parsePageLines = (lines: Line[]): string => {
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

export const storeToStorage = (data: DynamicConfig, w = window): TaskEither<Error, DynamicConfig> => {
  try {
    w.localStorage.setItem(storageKey, JSON.stringify(data));
    return right(data);
  } catch (e) {
    return left(e);
  }
};

const fetchConfigPage: Lazy<Promise<Page>> = () => getGlobalHelpers().then(({ scrapboxClient }) => scrapboxClient.getPage('config'));

const fromThunk = (thunk: Lazy<Promise<Page>>): TaskEither<Error, Page> => {
  return tryCatch(thunk, toError);
};

const toJsonStrings = map((res: Page) => parsePageLines(res.lines));

export const isObject = (v: unknown): v is object => {
  return v != null && typeof v === 'object';
};

// TODO: add property key assertions
export const isValid = (v: unknown): v is DynamicConfig => {
  return isObject(v);
};

const makeConfig = (json: string): TaskEither<Error, DynamicConfig> => {
  if (json === '') {
    return left(new Error('json string is empty, check contents in config page, it can be errored if an empty line not existed'));
  }

  try {
    const config = JSON.parse(json);
    if (isValid(config)) {
      return right(config);
    }

    return left(new Error('parsed object schema is invalid, check contents in config page'));
  } catch (e) {
    return left(new Error('invalid json schema, check contents in config page'));
  }
};

// see https://dev.to/ksaaskil/using-fp-ts-for-http-requests-and-validation-131c
export const syncAndPersist = pipe(
  fetchConfigPage,
  fromThunk,
  toJsonStrings,
  chain(makeConfig),
  chain(storeToStorage),
  fold(
    (error) => () => Promise.resolve<Error | DynamicConfig>(error),
    (config) => () => Promise.resolve<Error | DynamicConfig>(config),
  ),
);
