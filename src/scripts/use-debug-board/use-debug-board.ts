import { MyDebugBoard } from '../../components';

export const useDebugBoard = () => {
  const elem = new MyDebugBoard();
  document.body.appendChild(elem);
};
