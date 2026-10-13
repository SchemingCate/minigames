import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { loginForm } from './login-form';

beforeAll(() => {
  if (typeof CSS === 'undefined' || typeof CSS.escape !== 'function') {
    vi.stubGlobal('CSS', { escape: (value: string) => value });
  }
});
afterAll(() => {
  vi.unstubAllGlobals();
});

const VALID_EMAIL = 'user@example.com';
const VALID_PASSWORD = 'secret1';

const formOf = (root: HTMLElement) =>
  root.querySelector('form') as HTMLFormElement;

const field = (root: HTMLElement, name: string) =>
  formOf(root).elements.namedItem(name) as HTMLInputElement;

const errorOf = (root: HTMLElement, name: string) =>
  root.querySelector(`[data-error-for="${CSS.escape(name)}"]`)?.textContent;

const submitButton = (root: HTMLElement) =>
  formOf(root).querySelector('button[type="submit"]') as HTMLButtonElement;

const enter = (root: HTMLElement, name: string, value: string) => {
  const input = field(root, name);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

const didLeave = (root: HTMLElement, name: string) =>
  field(root, name).dispatchEvent(new Event('blur'));

const fillValid = (root: HTMLElement) => {
  enter(root, 'email', VALID_EMAIL);
  enter(root, 'password', VALID_PASSWORD);
};

const submit = (root: HTMLElement) => {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  formOf(root).dispatchEvent(event);
  return event;
};

const googleButton = (root: HTMLElement) =>
  [...root.querySelectorAll('button')].find(
    (button) => button.textContent === 'Continue with Google',
  ) as HTMLButtonElement;

describe('loginForm', () => {
  describe('structure', () => {
    it('renders heading, intro, form, separator and Google button in order', () => {
      const root = loginForm();

      expect(root.classList.contains('login-form')).toBe(true);
      expect([...root.children].map((child) => child.tagName)).toEqual([
        'H2',
        'P',
        'FORM',
        'SPAN',
        'BUTTON',
      ]);
    });

    it('greets the user and explains the form', () => {
      const root = loginForm();

      expect(root.querySelector('h2')?.textContent).toBe('Welcome back!');
      expect(root.querySelector('p')?.textContent).toBe(
        'Sign in to resume your games and progress.',
      );
    });

    it('separates the two sign-in options with "OR"', () => {
      expect(
        loginForm().querySelector(':scope > span')?.textContent?.trim(),
      ).toBe('OR');
    });

    it('puts the fields and the forgot-password link in the form body, then the submit button', () => {
      const form = formOf(loginForm());
      const body = form.firstElementChild as HTMLElement;

      expect([...form.children].map((child) => child.tagName)).toEqual([
        'DIV',
        'BUTTON',
      ]);
      expect([...body.children].map((child) => child.tagName)).toEqual([
        'DIV',
        'DIV',
        'A',
      ]);
      expect(body.querySelectorAll(':scope > .field')).toHaveLength(2);
    });

    it('creates a new element on every call', () => {
      expect(loginForm()).not.toBe(loginForm());
    });
  });

  describe('email field', () => {
    it('is a required email input with the email autocomplete hint', () => {
      const input = field(loginForm(), 'email');

      expect(input.getAttribute('id')).toBe('emailLogin');
      expect(input.getAttribute('type')).toBe('email');
      expect(input.required).toBe(true);
      expect(input.getAttribute('autocomplete')).toBe('email');
      expect(input.hasAttribute('pattern')).toBe(true);
    });

    it('is labelled "Email Address"', () => {
      const root = loginForm();
      const label = root.querySelector('label[for="emailLogin"]');

      expect(label?.textContent).toBe('Email Address');
    });

    it.each([
      'user@example.com',
      'first.last@mail.example.org',
      'a+tag@sub.domain.io',
    ])('accepts the address %s', (address) => {
      const root = loginForm();

      enter(root, 'email', address);

      expect(field(root, 'email').validity.valid).toBe(true);
      expect(errorOf(root, 'email')).toBe('');
    });

    it.each([
      ['no @ sign', 'not-an-email'],
      ['no dot in the domain', 'user@localhost'],
      ['a one-letter top-level domain', 'user@example.c'],
      ['two @ signs', 'user@@example.com'],
      ['a space in it', 'us er@example.com'],
    ])('rejects an address with %s', (_label, address) => {
      const root = loginForm();

      enter(root, 'email', address);

      expect(errorOf(root, 'email')).toBe('Please enter a valid email address');
    });
  });

  describe('password field', () => {
    it('is a required password input that works with password managers', () => {
      const input = field(loginForm(), 'password');

      expect(input.getAttribute('id')).toBe('passwordLogin');
      expect(input.getAttribute('type')).toBe('password');
      expect(input.required).toBe(true);
      expect(input.getAttribute('minlength')).toBe('6');
      expect(input.getAttribute('autocomplete')).toBe('current-password');
    });

    it('is labelled "Password"', () => {
      expect(
        loginForm().querySelector('label[for="passwordLogin"]')?.textContent,
      ).toBe('Password');
    });

    it('asks for a password when left empty', () => {
      const root = loginForm();

      didLeave(root, 'password');

      expect(errorOf(root, 'password')).toBe('Please enter your password');
    });

    it('does not impose the sign-up strength rules on an existing password', () => {
      const root = loginForm();

      enter(root, 'password', 'alllowercase');

      expect(errorOf(root, 'password')).toBe('');
    });
  });

  describe('forgot-password link', () => {
    it('is shown after the fields', () => {
      const body = formOf(loginForm()).firstElementChild as HTMLElement;

      expect(body.lastElementChild?.tagName).toBe('A');
      expect(body.lastElementChild?.textContent).toBe('Forgot Password?');
    });
  });

  describe('validation wiring', () => {
    it('starts with no errors shown', () => {
      const root = loginForm();

      expect(errorOf(root, 'email')).toBe('');
      expect(errorOf(root, 'password')).toBe('');
    });

    it('starts with the submit button disabled', () => {
      const button = submitButton(loginForm());

      expect(button.textContent).toBe('Login');
      expect(button.disabled).toBe(true);
    });

    it('shows an error only for the field the user touched', () => {
      const root = loginForm();

      didLeave(root, 'email');

      expect(errorOf(root, 'email')).toBe('Please enter your email');
      expect(errorOf(root, 'password')).toBe('');
    });

    it('enables the submit button once both fields are valid', () => {
      const root = loginForm();

      fillValid(root);

      expect(submitButton(root).disabled).toBe(false);
    });

    it('keeps the submit button disabled while only one field is valid', () => {
      const root = loginForm();

      enter(root, 'email', VALID_EMAIL);

      expect(submitButton(root).disabled).toBe(true);
    });

    it('disables the submit button again when the email is broken afterwards', () => {
      const root = loginForm();
      fillValid(root);

      enter(root, 'email', 'broken');

      expect(submitButton(root).disabled).toBe(true);
    });

    it('does not share state between two forms', () => {
      const first = loginForm();
      const second = loginForm();

      fillValid(first);

      expect(submitButton(first).disabled).toBe(false);
      expect(submitButton(second).disabled).toBe(true);
    });
  });

  describe('submitting', () => {
    it('blocks an invalid form and shows every error', () => {
      const root = loginForm();

      const event = submit(root);

      expect(event.defaultPrevented).toBe(true);
      expect(errorOf(root, 'email')).toBe('Please enter your email');
      expect(errorOf(root, 'password')).toBe('Please enter your password');
    });

    it('lets a valid form through', () => {
      const root = loginForm();
      fillValid(root);

      expect(submit(root).defaultPrevented).toBe(false);
    });
  });

  describe('Google button', () => {
    it('lives outside the form so it does not submit the login form', () => {
      const root = loginForm();
      let isSubmitted = false;
      formOf(root).addEventListener('submit', () => {
        isSubmitted = true;
      });

      googleButton(root).click();

      expect(formOf(root).contains(googleButton(root))).toBe(false);
      expect(isSubmitted).toBe(false);
    });
  });
});
