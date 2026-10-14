import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from 'vitest';
import { formValidation } from './form-validation';

beforeAll(() => {
  if (typeof CSS === 'undefined' || typeof CSS.escape !== 'function') {
    vi.stubGlobal('CSS', { escape: (value: string) => value });
  }
});
afterAll(() => {
  vi.unstubAllGlobals();
});

const VALID = {
  email: 'user@example.com',
  password: 'Abc123!x',
  username: 'Alice',
};

const fieldNames = ['email', 'password', 'confirmPassword', 'username'];

interface Options {
  confirm?: boolean;
  username?: boolean;
  extra?: string[];
}

const buildForm = ({
  confirm = true,
  username = true,
  extra = [],
}: Options = {}) => {
  document.body.innerHTML = String.raw`
    <form novalidate>
      <input name="email" type="email" required />
      <span data-error-for="email"></span>

      <input name="password" type="password" required minlength="6" pattern="(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S+" />
      <span data-error-for="password"></span>

      ${
        confirm
          ? `<input name="confirmPassword" type="password" required /> <span data-error-for="confirmPassword"></span>`
          : ''
      }
      ${
        username
          ? `<input name="username" type="text" required minlength="2" maxlength="30"
                    pattern="[A-Z][A-Za-z0-9]*" /> <span data-error-for="username"></span>`
          : ''
      }
      ${extra
        .map(
          (name) =>
            `<input name="${name}" /><span data-error-for="${name}"></span>`,
        )
        .join('')}
      <button type="submit">Send</button>
    </form>`;
  return document.querySelector('form') as HTMLFormElement;
};

const field = (form: HTMLFormElement, name: string) =>
  form.elements.namedItem(name) as HTMLInputElement;

const errorOf = (form: HTMLFormElement, name: string) =>
  form.querySelector(`[data-error-for="${CSS.escape(name)}"]`)?.textContent;

const submitButton = (form: HTMLFormElement) =>
  form.querySelector('button') as HTMLButtonElement;

const type = (form: HTMLFormElement, name: string, value: string) => {
  const input = field(form, name);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

const hasBlur = (form: HTMLFormElement, name: string) =>
  field(form, name).dispatchEvent(new Event('blur'));

const fillValid = (form: HTMLFormElement) => {
  type(form, 'email', VALID.email);
  type(form, 'password', VALID.password);
  if (form.elements.namedItem('confirmPassword')) {
    type(form, 'confirmPassword', VALID.password);
  }
  if (form.elements.namedItem('username'))
    type(form, 'username', VALID.username);
};

const submit = (form: HTMLFormElement) => {
  const event = new Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
  return event;
};

const forceValidity = (
  input: HTMLInputElement,
  flags: Record<string, boolean>,
) => {
  Object.defineProperty(input, 'validity', {
    configurable: true,
    value: { valid: false, ...flags },
  });
};

describe('formValidation', () => {
  let form: HTMLFormElement;

  beforeEach(() => {
    form = buildForm();
  });

  describe('initial state', () => {
    it('shows no errors before the user touches anything', () => {
      formValidation(form);

      for (const name of fieldNames) {
        expect(errorOf(form, name)).toBe('');
      }
    });

    it('disables the submit button while the form is invalid', () => {
      formValidation(form);

      expect(submitButton(form).disabled).toBe(true);
    });
  });

  describe('when errors appear', () => {
    it('shows an error for a field only after it was touched', () => {
      formValidation(form);

      hasBlur(form, 'email');

      expect(errorOf(form, 'email')).toBe('Please enter your email');
      expect(errorOf(form, 'password')).toBe('');
    });

    it.each(['input', 'change', 'blur'])(
      'marks a field as touched on "%s"',
      (eventName) => {
        formValidation(form);

        field(form, 'email').dispatchEvent(new Event(eventName));

        expect(errorOf(form, 'email')).toBe('Please enter your email');
      },
    );

    it('clears the error once the value becomes valid', () => {
      formValidation(form);
      hasBlur(form, 'email');

      type(form, 'email', VALID.email);

      expect(errorOf(form, 'email')).toBe('');
    });
  });

  describe('email', () => {
    it('asks for an address when empty', () => {
      formValidation(form);
      hasBlur(form, 'email');
      expect(errorOf(form, 'email')).toBe('Please enter your email');
    });

    it('rejects a malformed address', () => {
      formValidation(form);
      type(form, 'email', 'not-an-email');
      expect(errorOf(form, 'email')).toBe('Please enter a valid email address');
    });
  });

  describe('password', () => {
    it('asks for a password when empty', () => {
      formValidation(form);
      hasBlur(form, 'password');
      expect(errorOf(form, 'password')).toBe('Please enter your password');
    });

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
    ])('explains the pattern failure: %s', (_label, value, expected) => {
      formValidation(form);
      type(form, 'password', value);
      expect(errorOf(form, 'password')).toBe(expected);
    });

    it('accepts a strong password', () => {
      formValidation(form);
      type(form, 'password', VALID.password);
      expect(errorOf(form, 'password')).toBe('');
    });

    it('reports a too-short password', () => {
      formValidation(form);
      forceValidity(field(form, 'password'), { tooShort: true });

      hasBlur(form, 'password');

      expect(errorOf(form, 'password')).toBe(
        'Password must be at least 6 characters',
      );
    });

    it('reports "missing" before "too short" when both apply', () => {
      formValidation(form);
      forceValidity(field(form, 'password'), {
        valueMissing: true,
        tooShort: true,
      });

      hasBlur(form, 'password');

      expect(errorOf(form, 'password')).toBe('Please enter your password');
    });
  });

  describe('username', () => {
    it('is required', () => {
      formValidation(form);
      hasBlur(form, 'username');
      expect(errorOf(form, 'username')).toBe('Username is required.');
    });

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
      ['contains a space', 'Al ice', 'Use English letters and digits only'],
    ])('rejects a name that %s', (_label, value, expected) => {
      formValidation(form);
      type(form, 'username', value);
      expect(errorOf(form, 'username')).toBe(expected);
    });

    it('reports a too-short name', () => {
      formValidation(form);
      forceValidity(field(form, 'username'), { tooShort: true });
      hasBlur(form, 'username');
      expect(errorOf(form, 'username')).toBe(
        'Username must be at least 2 characters',
      );
    });

    it('reports a too-long name', () => {
      formValidation(form);
      forceValidity(field(form, 'username'), { tooLong: true });
      hasBlur(form, 'username');
      expect(errorOf(form, 'username')).toBe(
        'Username must be at most 30 characters',
      );
    });

    it('accepts a valid name', () => {
      formValidation(form);
      type(form, 'username', VALID.username);
      expect(errorOf(form, 'username')).toBe('');
    });
  });

  describe('confirm password', () => {
    it('asks for confirmation when empty', () => {
      formValidation(form);
      hasBlur(form, 'confirmPassword');
      expect(errorOf(form, 'confirmPassword')).toBe(
        'Please confirm your password',
      );
    });

    it('reports a mismatch', () => {
      formValidation(form);
      type(form, 'password', VALID.password);
      type(form, 'confirmPassword', 'Different1!');
      expect(errorOf(form, 'confirmPassword')).toBe('Passwords do not match');
    });

    it('accepts a matching value', () => {
      formValidation(form);
      type(form, 'password', VALID.password);
      type(form, 'confirmPassword', VALID.password);
      expect(errorOf(form, 'confirmPassword')).toBe('');
    });

    it('re-checks the match when the password is edited afterwards', () => {
      formValidation(form);
      type(form, 'password', VALID.password);
      type(form, 'confirmPassword', VALID.password);

      type(form, 'password', 'Other123!');

      expect(errorOf(form, 'confirmPassword')).toBe('Passwords do not match');
    });

    it('stops reporting the mismatch once the values match again', () => {
      formValidation(form);
      type(form, 'password', VALID.password);
      type(form, 'confirmPassword', 'nope');

      type(form, 'confirmPassword', VALID.password);

      expect(errorOf(form, 'confirmPassword')).toBe('');
    });
  });

  describe('unknown fields', () => {
    it('falls back to the browser validation message', () => {
      form = buildForm({ extra: ['nickname'] });
      formValidation(form);
      field(form, 'nickname').setCustomValidity('Nickname is taken');

      type(form, 'nickname', 'sparky');

      expect(errorOf(form, 'nickname')).toBe('Nickname is taken');
    });
  });

  describe('submit button', () => {
    it('is enabled once every field is valid', () => {
      formValidation(form);

      fillValid(form);

      expect(submitButton(form).disabled).toBe(false);
    });

    it('becomes disabled again when a field turns invalid', () => {
      formValidation(form);
      fillValid(form);

      type(form, 'email', 'broken');

      expect(submitButton(form).disabled).toBe(true);
    });
  });

  describe('submitting', () => {
    it('blocks an invalid form and reveals every error at once', () => {
      formValidation(form);

      const event = submit(form);

      expect(event.defaultPrevented).toBe(true);
      expect(errorOf(form, 'email')).toBe('Please enter your email');
      expect(errorOf(form, 'password')).toBe('Please enter your password');
      expect(errorOf(form, 'confirmPassword')).toBe(
        'Please confirm your password',
      );
      expect(errorOf(form, 'username')).toBe('Username is required.');
    });

    it('lets a valid form through', () => {
      formValidation(form);
      fillValid(form);

      const event = submit(form);

      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('reset', () => {
    it('clears values, errors and the touched state', () => {
      const reset = formValidation(form);
      fillValid(form);
      type(form, 'email', 'broken');
      expect(errorOf(form, 'email')).not.toBe('');

      reset();

      expect(field(form, 'email').value).toBe('');
      for (const name of fieldNames) {
        expect(errorOf(form, name)).toBe('');
      }
      expect(submitButton(form).disabled).toBe(true);
    });

    it('starts hiding errors again until a field is touched', () => {
      const reset = formValidation(form);
      hasBlur(form, 'email');
      reset();

      expect(errorOf(form, 'email')).toBe('');

      hasBlur(form, 'email');
      expect(errorOf(form, 'email')).toBe('Please enter your email');
    });
  });

  describe('a form without a confirm-password field (login)', () => {
    it('validates and enables submit without throwing', () => {
      form = buildForm({ confirm: false, username: false });

      expect(() => formValidation(form)).not.toThrow();
      fillValid(form);

      expect(submitButton(form).disabled).toBe(false);
    });
  });
});
