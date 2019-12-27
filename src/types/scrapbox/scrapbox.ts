import { ScrapboxPage } from './page';
import { ScrapboxProject } from './project';

export type Scrapbox = {
  Layout:
    | 'page'
    | 'list'
    | 'stream'
    | 'new-project-page'
    | 'project-settings-basic-page'
    | 'project-settings-members-page'
    | 'project-settings-theme-page'
    | 'project-settings-notifications-page'
    | 'project-settings-page-data-page'
    | 'project-settings-backup-page'
    | 'project-settings-advanced-page'
    | 'project-settings-billing-page'
    | 'settings-profile-page'
    | 'settings-extensions-page'
    | 'settings-delete-account-page';
  Page: ScrapboxPage;
  PageMenu: {
    addItem: (param: { title: string; onClick: () => void }) => void;
    addMenu: (param: { title: string; image: string; onClick: () => void }) => void;
    addSeparator: Function;
    removeAllItems: Function;
  };
  PopupMenu: {
    addButton: (param: { title: string; onClick: (selectedText: string) => string }) => void;
  };
  Project: ScrapboxProject;
  TimeStamp: {
    addFormat: (momentFormat: string) => void;
    removeAllFormats: () => void;
  };
};

// assuming, window.scrapbox exists when use type Scrapbox
declare global {
  interface Window {
    scrapbox: Scrapbox;
  }
}
