import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { ButtonType } from '../../../helpers/enums';
import { button } from '../button/button';
import { modal } from './modal';

beforeAll(() => {
  if (typeof CSS === 'undefined' || typeof CSS.escape !== 'function') {
    vi.stubGlobal('CSS', { escape: (value: string) => value });
  }
});
afterAll(() => {
  vi.unstubAllGlobals();
});

const LOGIN_HEADING = 'Welcome back!';
const REGISTER_HEADING = 'Create account';

const radio = (root: HTMLElement, mode: string) =>
  root.querySelector(`input[value="${CSS.escape(mode)}"]`) as HTMLInputElement;

const choose = (root: HTMLElement, mode: string) => {
  const input = radio(root, mode);
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

const heading = (root: HTMLElement) =>
  root.querySelector('.login-form_heading')?.textContent;

const formArea = (root: HTMLElement) =>
  root.querySelector(':scope > .modal_content > div') as HTMLElement;

describe('modal', () => {
  describe('structure', () => {
    it('renders a closed auth dialog', () => {
      const root = modal();

      expect(root.tagName).toBe('DIALOG');
      expect(root.id).toBe('auth');
      expect(root.classList.contains('modal')).toBe(true);
      expect(root.hasAttribute('open')).toBe(false);
    });

    it('contains the content first and the close button last', () => {
      const root = modal();

      expect(root.firstElementChild?.classList.contains('modal_content')).toBe(
        true,
      );
      expect(root.lastElementChild?.tagName).toBe('BUTTON');
      expect(root.children).toHaveLength(2);
    });

    it('puts the mode switcher before the form area in the content', () => {
      const content = modal().querySelector('.modal_content') as HTMLElement;

      expect([...content.children].map((child) => child.tagName)).toEqual([
        'FIELDSET',
        'DIV',
      ]);
    });

    it('creates a new dialog on every call', () => {
      expect(modal()).not.toBe(modal());
    });
  });

  describe('mode switcher', () => {
    it('offers login and register as labelled radios in one group', () => {
      const root = modal();
      const fieldset = root.querySelector('fieldset') as HTMLElement;

      expect([...fieldset.children].map((child) => child.tagName)).toEqual([
        'INPUT',
        'LABEL',
        'INPUT',
        'LABEL',
      ]);
      expect(radio(root, 'login').name).toBe('loginMode');
      expect(radio(root, 'register').name).toBe('loginMode');
      expect(root.querySelector('label[for="loginButton"]')?.textContent).toBe(
        'Login',
      );
      expect(
        root.querySelector('label[for="registerButton"]')?.textContent,
      ).toBe('Register');
    });

    it('connects each label to its radio', () => {
      const root = modal();

      expect(radio(root, 'login').id).toBe('loginButton');
      expect(radio(root, 'register').id).toBe('registerButton');
    });

    it('starts with login selected', () => {
      const root = modal();

      expect(radio(root, 'login').checked).toBe(true);
      expect(radio(root, 'register').checked).toBe(false);
    });
  });

  describe('form area', () => {
    it('starts with the login form only', () => {
      const root = modal();

      expect(heading(root)).toBe(LOGIN_HEADING);
      expect(formArea(root).querySelectorAll('form')).toHaveLength(1);
    });

    it('shows the register form when "register" is chosen', () => {
      const root = modal();

      choose(root, 'register');

      expect(heading(root)).toBe(REGISTER_HEADING);
      expect(radio(root, 'register').checked).toBe(true);
      expect(radio(root, 'login').checked).toBe(false);
    });

    it('replaces the form instead of stacking them', () => {
      const root = modal();

      choose(root, 'register');

      expect(formArea(root).querySelectorAll('form')).toHaveLength(1);
      expect(root.querySelectorAll('.login-form')).toHaveLength(1);
    });

    it('goes back to the login form when "login" is chosen again', () => {
      const root = modal();
      choose(root, 'register');

      choose(root, 'login');

      expect(heading(root)).toBe(LOGIN_HEADING);
      expect(formArea(root).querySelectorAll('form')).toHaveLength(1);
    });

    it('keeps working after many switches', () => {
      const root = modal();

      choose(root, 'register');
      choose(root, 'login');
      choose(root, 'register');

      expect(heading(root)).toBe(REGISTER_HEADING);
      expect(formArea(root).querySelectorAll('form')).toHaveLength(1);
    });

    it('does not touch the switcher when the form is replaced', () => {
      const root = modal();
      const fieldset = root.querySelector('fieldset');

      choose(root, 'register');

      expect(root.querySelector('fieldset')).toBe(fieldset);
    });
  });

  describe('changes that must be ignored', () => {
    it('ignores a change that does not come from a radio', () => {
      const root = modal();
      const fieldset = root.querySelector('fieldset') as HTMLElement;

      fieldset.dispatchEvent(new Event('change', { bubbles: true }));

      expect(heading(root)).toBe(LOGIN_HEADING);
    });

    it('ignores a radio with an unknown value', () => {
      const root = modal();
      const input = radio(root, 'register');
      input.value = 'unknown';

      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));

      expect(heading(root)).toBe(LOGIN_HEADING);
    });
  });

  describe('close button', () => {
    it('is the close-auth button', () => {
      const closeButton = modal().lastElementChild as HTMLButtonElement;

      expect(closeButton.textContent).toBe(ButtonType.CloseAuth);
      expect(closeButton.getAttribute('command')).toBe('close');
    });

    it('targets this dialog by id', () => {
      const root = modal();
      const closeButton = root.lastElementChild as HTMLButtonElement;

      expect(closeButton.getAttribute('commandfor')).toBe(root.id);
    });
  });

  describe('contract with the buttons that open it', () => {
    it.each([ButtonType.LogIn, ButtonType.SignUp])(
      'is the target of the "%s" button',
      (type) => {
        const opener = button(type);

        expect(opener.getAttribute('command')).toBe('show-modal');
        expect(opener.getAttribute('commandfor')).toBe(modal().id);
      },
    );
  });
});
