import './button.scss';
import { ButtonType } from '../../helpers/enums';

export const button = (type: ButtonType): HTMLButtonElement => {
  const buttonElement = document.createElement('button');
  buttonElement.classList = 'button';
  buttonElement.textContent = type;
  if (type === ButtonType.LogIn) {
    buttonElement.classList.add('button_login');
  }
  return buttonElement;
};
