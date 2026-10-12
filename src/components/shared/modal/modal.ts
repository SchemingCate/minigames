import './modal.scss';
import { createHTMLElement } from '../../../helpers/dom';
import { button } from '../button/button';
import { ButtonType } from '../../../helpers/enums';
import { loginForm } from '../login-form/login-form';
import { registerForm } from '../register-form/register-form';

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

  const modeButtonsContainer = createHTMLElement({ tag: 'fieldset' });

  const modeRadioLogin = createHTMLElement({
    tag: 'input',
    attributes: [
      ['type', 'radio'],
      ['id', 'loginButton'],
      ['value', 'login'],
      ['checked', ''],
      ['name', 'loginMode'],
    ],
  });
  const modeLabelLogin = createHTMLElement({
    tag: 'label',
    textContent: 'Login',
    attributes: [['for', 'loginButton']],
  });

  const modeRadioRegister = createHTMLElement({
    tag: 'input',
    attributes: [
      ['type', 'radio'],
      ['value', 'register'],
      ['id', 'registerButton'],
      ['name', 'loginMode'],
    ],
  });
  const modeLabelRegister = createHTMLElement({
    tag: 'label',
    textContent: 'Register',
    attributes: [['for', 'registerButton']],
  });

  modeButtonsContainer.append(
    modeRadioLogin,
    modeLabelLogin,
    modeRadioRegister,
    modeLabelRegister,
  );

  const formContainer = createHTMLElement({ tag: 'div' });

  modeButtonsContainer.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    if (target.type !== 'radio') return;
    switch (target.value) {
      case 'login': {
        formContainer.replaceChildren(loginForm());
        break;
      }
      case 'register': {
        formContainer.replaceChildren(registerForm());
        break;
      }
      default: {
        return;
      }
    }
  });

  formContainer.append(loginForm());

  authDialogContent.append(modeButtonsContainer, formContainer);

  const closeButton = button(ButtonType.CloseAuth);
  authDialog.append(authDialogContent, closeButton);
  return authDialog;
};
