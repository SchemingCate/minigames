import './modal.scss';
import { createHTMLElement } from '../../helpers/dom';
import { button } from '../button/button';
import { ButtonType } from '../../helpers/enums';

export const modal = (): HTMLElement => {
  const modal = createHTMLElement({
    tag: 'dialog',
    classList: 'modal',
    textContent: 'Auth window',
    attributes: [['id', 'auth']],
  });
  const closeButton = button(ButtonType.CloseAuth);
  modal.append(closeButton);
  return modal;
};
