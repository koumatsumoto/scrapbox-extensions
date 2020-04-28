import { tryCatch } from 'fp-ts/es6/Option';
import { version } from '../../../../version';

const storageKey = 'sx-user-script-version';

const showVersion = (storage: Storage): void => {
  const currentVersion = storage.getItem(storageKey);
  if (version !== currentVersion) {
    console.log('[sx/version-notificator] new version detected', version);
    storage.setItem(storageKey, version);
  }

  return;
};

export const useVersionNotificator = (w = window) => tryCatch(() => showVersion(w.localStorage));
