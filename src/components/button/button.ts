import './button.scss';
import { ButtonType } from '../../helpers/enums';

export const button = (type: ButtonType): HTMLButtonElement => {
  const buttonElement = document.createElement('button');
  buttonElement.classList = 'button';
  buttonElement.textContent = type;
  if (type === ButtonType.SignUp) {
    buttonElement.classList.add('button_signup');
  }
  if (type === ButtonType.LogIn) {
    buttonElement.classList.add('button_login');
  }
  if (type === ButtonType.Burger) {
    buttonElement.classList.add('button_burger');
    const span = document.createElement('span');
    buttonElement.textContent = '';
    buttonElement.append(span);
  }
  return buttonElement;
};
