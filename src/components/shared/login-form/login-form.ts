import { createHTMLElement } from '../../../helpers/dom';
import { createField } from '../input/input';

export const loginForm = () => {
  const container = createHTMLElement({ tag: 'div' });

  const heading = createHTMLElement({
    tag: 'h2',
    textContent: 'Welcome back!',
  });
  const paragraph = createHTMLElement({
    tag: 'p',
    textContent: 'Sign in to resume your games and progress.',
  });

  const form = createHTMLElement({ tag: 'form' });

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

  form.append(emailField, passwordField, linkResetPassword, buttonSubmit);

  container.append(heading, paragraph, form, span, buttonGoogleLogin);

  return container;
};
