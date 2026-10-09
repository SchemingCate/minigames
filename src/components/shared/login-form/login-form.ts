import './login-form.scss';
import { createHTMLElement } from '../../../helpers/dom';
import { createField } from '../input/input';

export const loginForm = () => {
  const container = createHTMLElement({ tag: 'div', classList: 'login-form' });

  const heading = createHTMLElement({
    tag: 'h2',
    textContent: 'Welcome back!',
    classList: 'login-form_heading',
  });
  const paragraph = createHTMLElement({
    tag: 'p',
    textContent: 'Sign in to resume your games and progress.',
    classList: 'login-form_paragraph',
  });

  const form = createHTMLElement({ tag: 'form', classList: 'login-form_form' });

  const formBody = createHTMLElement({
    tag: 'form',
    classList: 'login-form_form_body',
  });

  const emailField = createField({
    id: 'emailLogin',
    type: 'email',
    label: 'Email Address',
    placeholder: 'e.g. alex@minigames.com',
  });

  const passwordField = createField({
    id: 'passwordLogin',
    type: 'password',
    label: 'Password',
    placeholder: '••••••••',
  });

  const linkResetPassword = createHTMLElement({
    tag: 'a',
    textContent: 'Forgot Password?',
    attributes: [['src', '']],
  });

  formBody.append(emailField, passwordField, linkResetPassword);

  const buttonSubmit = createHTMLElement({
    tag: 'button',
    textContent: 'Login',
    attributes: [['type', 'submit']],
  });

  const span = createHTMLElement({ tag: 'span', textContent: ' OR' });
  const buttonGoogleLogin = createHTMLElement({
    tag: 'button',
    textContent: 'Continue with Google',
  });

  form.append(formBody, buttonSubmit);

  container.append(heading, paragraph, form, span, buttonGoogleLogin);

  return container;
};
