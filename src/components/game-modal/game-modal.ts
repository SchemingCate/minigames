import { createHTMLElement } from '../../helpers/dom';
import './game-modal.scss';

export const gameModal = (): HTMLElement => {
  const gameModal = createHTMLElement({
    tag: 'dialog',
    attributes: [['id', 'gameModal']],
    textContent: 'the Game Details dialog',
    classList: 'gameModal',
  });
  return gameModal;
};
