import { describe, it, expect } from 'vitest';
import { createField } from './input';

type FieldOptions = Parameters<typeof createField>[0];

const baseOptions: FieldOptions = {
  id: 'email-field',
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'you@example.com',
};

const render = (options: Partial<FieldOptions> = {}) =>
  createField({ ...baseOptions, ...options });

const inputOf = (root: HTMLElement) =>
  root.querySelector('input') as HTMLInputElement;

const optionalAttributes = [
  'required',
  'minlength',
  'maxlength',
  'autocomplete',
  'pattern',
];

describe('createField', () => {
  describe('structure', () => {
    it('renders a field with a label and an input container, in that order', () => {
      const root = render();

      expect(root.tagName).toBe('DIV');
      expect(root.classList.contains('field')).toBe(true);
      expect([...root.children].map((child) => child.tagName)).toEqual([
        'LABEL',
        'DIV',
      ]);
    });

    it('puts the input before its error element inside the container', () => {
      const container = render().querySelector(
        '.field_input-container',
      ) as HTMLElement;

      expect([...container.children].map((child) => child.tagName)).toEqual([
        'INPUT',
        'SPAN',
      ]);
    });

    it('creates a new element on every call', () => {
      expect(render()).not.toBe(render());
    });
  });

  describe('label', () => {
    it('shows the label text', () => {
      const label = render({ label: 'Password' }).querySelector(
        'label',
      ) as HTMLLabelElement;

      expect(label.textContent).toBe('Password');
      expect(label.classList.contains('field_label')).toBe(true);
    });

    it('points at the input through the id', () => {
      const root = render({ id: 'password-field' });
      const label = root.querySelector('label') as HTMLLabelElement;

      expect(label.getAttribute('for')).toBe('password-field');
      expect(inputOf(root).id).toBe('password-field');
    });
  });

  describe('input', () => {
    it('gets type, name, id and placeholder from the options', () => {
      const input = inputOf(
        render({
          id: 'user-field',
          name: 'username',
          type: 'text',
          placeholder: 'Your name',
        }),
      );

      expect(input.getAttribute('type')).toBe('text');
      expect(input.getAttribute('name')).toBe('username');
      expect(input.getAttribute('id')).toBe('user-field');
      expect(input.getAttribute('placeholder')).toBe('Your name');
    });

    it('has the input style class', () => {
      expect(
        inputOf(render()).classList.contains('field_input-container_input'),
      ).toBe(true);
    });
  });

  describe('error element', () => {
    it('is empty and linked to the input by name', () => {
      const root = render({ name: 'username' });
      const error = root.querySelector(
        '.field_input-container_error',
      ) as HTMLElement;

      expect(error.tagName).toBe('SPAN');
      expect(error.textContent).toBe('');
      expect(error.dataset.errorFor).toBe('username');
    });

    it('can be found with the selector the form validation uses', () => {
      const root = render({ name: 'confirmPassword' });

      expect(root.querySelector('[data-error-for="confirmPassword"]')).toBe(
        root.querySelector('.field_input-container_error'),
      );
    });
  });

  describe('optional constraints', () => {
    it('sets none of them when they are not given', () => {
      const input = inputOf(render());

      for (const attribute of optionalAttributes) {
        expect(input.hasAttribute(attribute)).toBe(false);
      }
    });

    it('marks the input as required', () => {
      const input = inputOf(render({ required: true }));

      expect(input.hasAttribute('required')).toBe(true);
    });

    it('does not mark the input as required when required is false', () => {
      expect(
        inputOf(render({ required: false })).hasAttribute('required'),
      ).toBe(false);
    });

    it('sets the minimum and maximum length', () => {
      const input = inputOf(render({ minLength: 2, maxLength: 30 }));

      expect(input.getAttribute('minlength')).toBe('2');
      expect(input.getAttribute('maxlength')).toBe('30');
    });

    it('sets the autocomplete hint', () => {
      const input = inputOf(render({ autocomplete: 'current-password' }));

      expect(input.getAttribute('autocomplete')).toBe('current-password');
    });

    it('sets the pattern', () => {
      const input = inputOf(render({ pattern: '[A-Z][a-z]+' }));

      expect(input.getAttribute('pattern')).toBe('[A-Z][a-z]+');
    });

    it('applies several constraints together without touching the others', () => {
      const input = inputOf(render({ required: true, minLength: 6 }));

      expect(input.hasAttribute('required')).toBe(true);
      expect(input.getAttribute('minlength')).toBe('6');
      expect(input.hasAttribute('maxlength')).toBe(false);
      expect(input.hasAttribute('pattern')).toBe(false);
    });
  });

  describe('browser validation', () => {
    it('rejects an empty value when required', () => {
      const input = inputOf(render({ required: true }));

      expect(input.validity.valueMissing).toBe(true);
    });

    it('accepts an empty value when not required', () => {
      expect(inputOf(render()).validity.valid).toBe(true);
    });

    it('rejects a value that does not match the pattern', () => {
      const input = inputOf(render({ type: 'text', pattern: '[A-Z][a-z]+' }));

      input.value = 'alice';

      expect(input.validity.patternMismatch).toBe(true);
    });

    it('accepts a value that matches the pattern', () => {
      const input = inputOf(render({ type: 'text', pattern: '[A-Z][a-z]+' }));

      input.value = 'Alice';

      expect(input.validity.valid).toBe(true);
    });
  });
});
