import { createHTMLElement } from '../../../helpers/dom';
import { formValidation } from '../../../helpers/form-validation';
import { createField } from '../input/input';

export const registerForm = () => {
  const container = createHTMLElement({ tag: 'div', classList: 'login-form' });

  const heading = createHTMLElement({
    tag: 'h2',
    textContent: 'Create account',
    classList: 'login-form_heading',
  });
  const paragraph = createHTMLElement({
    tag: 'p',
    textContent: 'Join MiniGames to track your score & streak.',
    classList: 'login-form_paragraph',
  });

  const form = createHTMLElement({ tag: 'form', classList: 'login-form_form' });

  const formBody = createHTMLElement({
    tag: 'div',
    classList: 'login-form_form_body',
  });

  const usernameField = createField({
    id: 'username',
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'e.g. CozyGamer_99',
    required: true,
    autocomplete: 'username',
    minLength: 2,
    pattern: '[A-Z][A-Za-z0-9]*',
  });

  const emailField = createField({
    id: 'emailRegister',
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'your.email@domain.com',
    required: true,
    autocomplete: 'email',
    pattern: String.raw`[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[^\s@.]{2,}`,
  });

  const passwordField = createField({
    id: 'passwordRegister',
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Min. 8 characters',
    required: true,
    pattern: String.raw`(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[\x21-\x7E]{6,}`,
    minLength: 6,
    autocomplete: 'new-password',
  });

  const confirmPasswordField = createField({
    id: 'confirmPasswordRegister',
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Repeat your password',
    required: true,
    autocomplete: 'new-password',
  });

  formBody.append(
    usernameField,
    emailField,
    passwordField,
    confirmPasswordField,
  );

  const buttonSubmit = createHTMLElement({
    tag: 'button',
    textContent: 'Create account',
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
