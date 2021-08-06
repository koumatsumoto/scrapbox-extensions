import { SxEditWordsForm } from './edit-words-form';

export default {
  title: 'SxEditWordsForm',
  component: SxEditWordsForm,
};

export const WithCheckbox = () =>
  new SxEditWordsForm({
    tagOptions: [
      { name: 'S', type: 'tag1' },
      { name: 'T', type: 'tag1' },
      { name: 'タグA', type: 'tag2' },
      { name: 'タグB', type: 'tag2' },
      { name: 'タグC', type: 'tag2' },
    ],
  });
export const NoCheckbox = () => new SxEditWordsForm();
