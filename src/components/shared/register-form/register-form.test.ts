import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { registerForm } from './register-form';

beforeAll(() => {
  if (typeof CSS === 'undefined' || typeof CSS.escape !== 'function') {
    vi.stubGlobal('CSS', { escape: (value: string) => value });
  }
});
afterAll(() => {
  vi.unstubAllGlobals();
});

const VALID = {
  username: 'Alice',
  email: 'user@example.com',
  password: 'Abc123!x',
};

const fieldNames = ['username', 'email', 'password', 'confirmPassword'];

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
  enter(root, 'username', VALID.username);
  enter(root, 'email', VALID.email);
  enter(root, 'password', VALID.password);
  enter(root, 'confirmPassword', VALID.password);
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

describe('registerForm', () => {
  describe('structure', () => {
    it('renders heading, intro, form, separator and Google button in order', () => {
      const root = registerForm();

      expect(root.classList.contains('login-form')).toBe(true);
      expect([...root.children].map((child) => child.tagName)).toEqual([
        'H2',
        'P',
        'FORM',
        'SPAN',
        'BUTTON',
      ]);
    });

    it('invites the user to create an account', () => {
      const root = registerForm();

      expect(root.querySelector('h2')?.textContent).toBe('Create account');
      expect(root.querySelector('p')?.textContent).toBe(
        'Join MiniGames to track your score & streak.',
      );
    });

    it('separates the two sign-up options with "OR"', () => {
      expect(
        registerForm().querySelector(':scope > span')?.textContent?.trim(),
      ).toBe('OR');
    });

    it('puts four fields in the form body, then the submit button', () => {
      const form = formOf(registerForm());
      const body = form.firstElementChild as HTMLElement;

      expect([...form.children].map((child) => child.tagName)).toEqual([
        'DIV',
        'BUTTON',
      ]);
      expect(body.querySelectorAll(':scope > .field')).toHaveLength(4);
      expect(body.children).toHaveLength(4);
    });

    it('orders the fields username, email, password, confirm password', () => {
      const names = [...formOf(registerForm()).querySelectorAll('input')].map(
        (input) => input.name,
      );

      expect(names).toEqual(fieldNames);
    });

    it('creates a new element on every call', () => {
      expect(registerForm()).not.toBe(registerForm());
    });
  });

  describe('fields', () => {
    it.each([
      ['username', 'username', 'text', 'username'],
      ['email', 'emailRegister', 'email', 'email'],
      ['password', 'passwordRegister', 'password', 'new-password'],
      [
        'confirmPassword',
        'confirmPasswordRegister',
        'password',
        'new-password',
      ],
    ])(
      '%s is a required %s input with the right type and autocomplete hint',
      (name, id, type, autocomplete) => {
        const input = field(registerForm(), name);

        expect(input.getAttribute('id')).toBe(id);
        expect(input.getAttribute('type')).toBe(type);
        expect(input.required).toBe(true);
        expect(input.getAttribute('autocomplete')).toBe(autocomplete);
      },
    );

    it.each([
      ['username', 'Username'],
      ['emailRegister', 'Email Address'],
      ['passwordRegister', 'Password'],
      ['confirmPasswordRegister', 'Confirm Password'],
    ])('labels the field %s as "%s"', (id, text) => {
      expect(
        registerForm().querySelector(`label[for="${CSS.escape(id)}"]`)
          ?.textContent,
      ).toBe(text);
    });

    it('gives username and password a minimum length and the matching rules', () => {
      const root = registerForm();

      expect(field(root, 'username').getAttribute('minlength')).toBe('2');
      expect(field(root, 'username').hasAttribute('pattern')).toBe(true);
      expect(field(root, 'password').getAttribute('minlength')).toBe('6');
      expect(field(root, 'password').hasAttribute('pattern')).toBe(true);
    });

    it('leaves confirm password free of pattern rules, since it only has to match', () => {
      const input = field(registerForm(), 'confirmPassword');

      expect(input.hasAttribute('pattern')).toBe(false);
      expect(input.hasAttribute('minlength')).toBe(false);
    });
  });

  describe('validation wiring', () => {
    it('starts with no errors shown', () => {
      const root = registerForm();

      for (const name of fieldNames) {
        expect(errorOf(root, name)).toBe('');
      }
    });

    it('starts with the submit button disabled', () => {
      const button = submitButton(registerForm());

      expect(button.textContent).toBe('Create account');
      expect(button.disabled).toBe(true);
    });

    it('shows an error only for the field the user touched', () => {
      const root = registerForm();

      didLeave(root, 'username');

      expect(errorOf(root, 'username')).toBe('Username is required.');
      expect(errorOf(root, 'email')).toBe('');
    });

    it('enables the submit button once every field is valid', () => {
      const root = registerForm();

      fillValid(root);

      expect(submitButton(root).disabled).toBe(false);
    });

    it('keeps the submit button disabled while the confirmation is missing', () => {
      const root = registerForm();
      enter(root, 'username', VALID.username);
      enter(root, 'email', VALID.email);
      enter(root, 'password', VALID.password);

      expect(submitButton(root).disabled).toBe(true);
    });

    it('does not share state between two forms', () => {
      const first = registerForm();
      const second = registerForm();

      fillValid(first);

      expect(submitButton(first).disabled).toBe(false);
      expect(submitButton(second).disabled).toBe(true);
    });
  });

  describe('username rules', () => {
    it.each([
      [
        'starts with a lowercase letter',
        'alice',
        'Must start with an uppercase English letter',
      ],
      [
        'starts with a digit',
        '1Alice',
        'Must start with an uppercase English letter',
      ],
      ['contains a symbol', 'Al-ice', 'Use English letters and digits only'],
      [
        'contains an underscore',
        'Al_ice',
        'Use English letters and digits only',
      ],
    ])('rejects a name that %s', (_label, value, expected) => {
      const root = registerForm();

      enter(root, 'username', value);

      expect(errorOf(root, 'username')).toBe(expected);
    });

    it.each(['Alice', 'CozyGamer99', 'AB'])('accepts the name %s', (value) => {
      const root = registerForm();

      enter(root, 'username', value);

      expect(errorOf(root, 'username')).toBe('');
    });
  });

  describe('email rules', () => {
    it.each(['user@example.com', 'first.last@mail.example.org'])(
      'accepts the address %s',
      (address) => {
        const root = registerForm();

        enter(root, 'email', address);

        expect(errorOf(root, 'email')).toBe('');
      },
    );

    it.each([
      ['no @ sign', 'not-an-email'],
      ['no dot in the domain', 'user@localhost'],
      ['a one-letter top-level domain', 'user@example.c'],
    ])('rejects an address with %s', (_label, address) => {
      const root = registerForm();

      enter(root, 'email', address);

      expect(errorOf(root, 'email')).toBe('Please enter a valid email address');
    });
  });

  describe('password rules', () => {
    it.each([
      [
        'no uppercase letter',
        'abc123!x',
        'Add at least one uppercase English letter',
      ],
      ['no digit', 'Abcdef!x', 'Add at least one digit'],
      [
        'no special character',
        'Abc12345',
        'Add at least one special character.',
      ],
      [
        'a space in it',
        'Abc 123!x',
        'Use English letters, digits and special characters only (no spaces).',
      ],
    ])(
      'explains the failure for a password with %s',
      (_label, value, expected) => {
        const root = registerForm();

        enter(root, 'password', value);

        expect(errorOf(root, 'password')).toBe(expected);
      },
    );

    it.each(['Abc123!x', 'Zz9#zz', 'Str0ng&Secure'])(
      'accepts the password %s',
      (value) => {
        const root = registerForm();

        enter(root, 'password', value);

        expect(errorOf(root, 'password')).toBe('');
      },
    );
  });

  describe('confirm password', () => {
    it('asks for confirmation when left empty', () => {
      const root = registerForm();

      didLeave(root, 'confirmPassword');

      expect(errorOf(root, 'confirmPassword')).toBe(
        'Please confirm your password',
      );
    });

    it('reports a mismatch', () => {
      const root = registerForm();
      enter(root, 'password', VALID.password);

      enter(root, 'confirmPassword', 'Different1!');

      expect(errorOf(root, 'confirmPassword')).toBe('Passwords do not match');
    });

    it('accepts a matching value', () => {
      const root = registerForm();
      enter(root, 'password', VALID.password);

      enter(root, 'confirmPassword', VALID.password);

      expect(errorOf(root, 'confirmPassword')).toBe('');
    });

    it('reports a mismatch when the password is changed after confirming', () => {
      const root = registerForm();
      enter(root, 'password', VALID.password);
      enter(root, 'confirmPassword', VALID.password);

      enter(root, 'password', 'Other123!');

      expect(errorOf(root, 'confirmPassword')).toBe('Passwords do not match');
    });

    it('keeps the form blocked while the passwords differ', () => {
      const root = registerForm();
      fillValid(root);

      enter(root, 'confirmPassword', 'Different1!');

      expect(submitButton(root).disabled).toBe(true);
    });
  });

  describe('submitting', () => {
    it('blocks an empty form and shows every error', () => {
      const root = registerForm();

      const event = submit(root);

      expect(event.defaultPrevented).toBe(true);
      expect(errorOf(root, 'username')).toBe('Username is required.');
      expect(errorOf(root, 'email')).toBe('Please enter your email');
      expect(errorOf(root, 'password')).toBe('Please enter your password');
      expect(errorOf(root, 'confirmPassword')).toBe(
        'Please confirm your password',
      );
    });

    it('lets a valid form through', () => {
      const root = registerForm();
      fillValid(root);

      expect(submit(root).defaultPrevented).toBe(false);
    });
  });

  describe('Google button', () => {
    it('lives outside the form so it does not submit the registration form', () => {
      const root = registerForm();
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
