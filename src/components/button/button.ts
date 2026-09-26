import './button.scss';
import { ButtonType } from '../../helpers/enums';

export const button = (type: ButtonType): HTMLButtonElement => {
  const buttonElement = document.createElement('button');
  buttonElement.classList = 'button';
  buttonElement.textContent = type;
  if (type === ButtonType.SignUp) {
    buttonElement.classList.add('button_signup');
    buttonElement.setAttribute('command', 'show-modal');
    buttonElement.setAttribute('commandfor', 'auth');
  }
  if (type === ButtonType.LogIn) {
    buttonElement.classList.add('button_login');
    buttonElement.setAttribute('command', 'show-modal');
    buttonElement.setAttribute('commandfor', 'auth');
  }
  if (type === ButtonType.Burger) {
    buttonElement.classList.add('button_burger');
    const span = document.createElement('span');
    buttonElement.textContent = '';
    buttonElement.append(span);
  }
  if (type === ButtonType.CloseAuth) {
    buttonElement.setAttribute('commandfor', 'auth');
    buttonElement.setAttribute('command', 'close');
  }
  if (type === ButtonType.Library) {
    buttonElement.classList.add('button_library');
  }
  return buttonElement;
};
