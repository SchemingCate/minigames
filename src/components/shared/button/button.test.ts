import { describe, it, expect } from 'vitest';
import { ButtonType } from '../../../helpers/enums';
import { button } from './button';

const commandAttributes = (element: HTMLButtonElement) => ({
  command: element.getAttribute('command') ?? undefined,
  commandfor: element.getAttribute('commandfor') ?? undefined,
});

describe('button', () => {
  describe('every type', () => {
    const allTypes = Object.values(ButtonType);

    it('has types to test', () => {
      // guards the loops below against passing on an empty list
      expect(allTypes.length).toBeGreaterThan(0);
    });

    it.each(allTypes)('"%s" renders a <button> with the base class', (type) => {
      const element = button(type);

      expect(element).toBeInstanceOf(HTMLButtonElement);
      expect(element.classList.contains('button')).toBe(true);
    });

    it('creates a new element on every call', () => {
      expect(button(ButtonType.Library)).not.toBe(button(ButtonType.Library));
    });
  });

  describe('sign up', () => {
    it('shows its label with the signup style', () => {
      const element = button(ButtonType.SignUp);

      expect(element.textContent).toBe(ButtonType.SignUp);
      expect([...element.classList]).toEqual(['button', 'button_signup']);
    });

    it('opens the auth dialog', () => {
      expect(commandAttributes(button(ButtonType.SignUp))).toEqual({
        command: 'show-modal',
        commandfor: 'auth',
      });
    });
  });

  describe('log in', () => {
    it('shows its label with the login style', () => {
      const element = button(ButtonType.LogIn);

      expect(element.textContent).toBe(ButtonType.LogIn);
      expect([...element.classList]).toEqual(['button', 'button_login']);
    });

    it('opens the auth dialog', () => {
      expect(commandAttributes(button(ButtonType.LogIn))).toEqual({
        command: 'show-modal',
        commandfor: 'auth',
      });
    });
  });

  describe('burger', () => {
    it('has the burger style', () => {
      expect([...button(ButtonType.Burger).classList]).toEqual([
        'button',
        'button_burger',
      ]);
    });

    it('shows an empty span instead of a text label', () => {
      const element = button(ButtonType.Burger);

      expect(element.textContent).toBe('');
      expect(element.children).toHaveLength(1);
      expect(element.firstElementChild?.tagName).toBe('SPAN');
    });

    it('does not control any dialog', () => {
      expect(commandAttributes(button(ButtonType.Burger))).toEqual({
        command: undefined,
        commandfor: undefined,
      });
    });
  });

  describe('close auth', () => {
    it('shows its label without an extra style', () => {
      const element = button(ButtonType.CloseAuth);

      expect(element.textContent).toBe(ButtonType.CloseAuth);
      expect(element.className).toBe('button');
    });

    it('closes the auth dialog', () => {
      expect(commandAttributes(button(ButtonType.CloseAuth))).toEqual({
        command: 'close',
        commandfor: 'auth',
      });
    });
  });

  describe('library', () => {
    it('shows its label with the library style', () => {
      const element = button(ButtonType.Library);

      expect(element.textContent).toBe(ButtonType.Library);
      expect([...element.classList]).toEqual(['button', 'button_library']);
    });

    it('is a plain button that controls no dialog', () => {
      expect(commandAttributes(button(ButtonType.Library))).toEqual({
        command: undefined,
        commandfor: undefined,
      });
    });
  });
});
