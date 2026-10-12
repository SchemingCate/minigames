import './login-form.scss';
import { createHTMLElement } from '../../../helpers/dom';
import { createField } from '../input/input';
import { formValidation } from '../../../helpers/form-validation';

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
    tag: 'div',
    classList: 'login-form_form_body',
  });

  const emailField = createField({
    id: 'emailLogin',
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'e.g. alex@minigames.com',
    required: true,
    autocomplete: 'email',
    pattern: String.raw`[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[^\s@.]{2,}`,
  });

  const passwordField = createField({
    id: 'passwordLogin',
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: '••••••••',
    required: true,
    minLength: 6,
    autocomplete: 'current-password',
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
    attributes: [
      ['type', 'submit'],
      ['disabled', ''],
    ],
  });

  const span = createHTMLElement({ tag: 'span', textContent: ' OR' });
  const buttonGoogleLogin = createHTMLElement({
    tag: 'button',
    textContent: 'Continue with Google',
    attributes: [['type', 'submit']],
  });

  form.append(formBody, buttonSubmit);

  container.append(heading, paragraph, form, span, buttonGoogleLogin);

  formValidation(form);

  return container;
};
