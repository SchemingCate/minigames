import { createHTMLElement } from '../../helpers/dom';
import './game-modal.scss';

export const gameModal = (): HTMLElement => {
  const gameModal = createHTMLElement({
    tag: 'dialog',
    attributes: [['id', 'gameModal']],
    classList: 'game-modal',
  });

  const content = createHTMLElement({
    tag: 'div',
    textContent: 'the Game Details dialog',
    classList: 'game-modal_content',
  });

  const closeButton = createHTMLElement({
    tag: 'button',
    attributes: [
      ['commandfor', 'gameModal'],
      ['command', 'close'],
    ],
    textContent: 'Close',
  });

  content.append(closeButton);
  gameModal.append(content);

  gameModal.addEventListener('click', (event) => {
    if (event.target === gameModal) gameModal.close();
  });

  return gameModal;
};
