import { SxButton } from './buttons';

export default {
  title: 'SxButtons',
  component: SxButton,
};

export const Default = () => '<button is="sx-button">default</button>';
export const Primary = () => '<button is="sx-button" data-color="primary">primary</button>';
export const Flat = () => '<button is="sx-button" data-type="flat" data-color="primary">primary</button>';
