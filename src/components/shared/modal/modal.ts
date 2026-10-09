import './modal.scss';
import { createHTMLElement } from '../../../helpers/dom';
import { button } from '../button/button';
import { ButtonType } from '../../../helpers/enums';
import { loginForm } from '../login-form/login-form';

export const modal = (): HTMLElement => {
  const authDialog = createHTMLElement({
    tag: 'dialog',
    classList: 'modal',
    attributes: [['id', 'auth']],
  });

  const authDialogContent = createHTMLElement({
    tag: 'div',
    classList: 'modal_content',
  });

  const modeButtonsContainer = createHTMLElement({ tag: 'div' });

  const modeButtonLogin = createHTMLElement({
    tag: 'button',
    textContent: 'Login',
  });
  const modeButtonRegister = createHTMLElement({
    tag: 'button',
    textContent: 'Register',
  });
  modeButtonsContainer.append(modeButtonLogin, modeButtonRegister);

  authDialogContent.append(modeButtonsContainer, loginForm());

  const closeButton = button(ButtonType.CloseAuth);
  authDialog.append(authDialogContent, closeButton);
  return authDialog;
};
