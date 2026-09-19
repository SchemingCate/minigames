import './button.scss';

export const button = (text: string): HTMLButtonElement => {
  const buttonElement = document.createElement('button');
  buttonElement.classList =
    text === 'Log in' ? 'button button_login' : 'button';
  buttonElement.textContent = text;
  return buttonElement;
};
