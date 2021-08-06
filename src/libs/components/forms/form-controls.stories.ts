import { SxInput } from './form-controls';

export default {
  title: 'SxInput',
  component: SxInput,
};

export const Input = () => '<input is="sx-input" type="text" />';
export const Checkbox = () => `
<input is="sx-checkbox" type="checkbox" name="checkbox-name" value="checkbox-value" label="checkbox label" />
<input is="sx-checkbox" type="checkbox" name="checkbox-name" value="checkbox-value" label="checkbox label" checked></sx-checkbox>`;
