import { describe, it, expect } from 'vitest';
import { createHTMLElement } from './dom';

describe('createHTMLElement', () => {
  it('creates an element with the requested tag', () => {
    const element = createHTMLElement({ tag: 'section' });

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName).toBe('SECTION');
  });

  it('returns the specific element type for the tag', () => {
    const button = createHTMLElement({ tag: 'button' });
    const input = createHTMLElement({ tag: 'input' });

    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(input).toBeInstanceOf(HTMLInputElement);
  });

  it('creates a bare element when only the tag is given', () => {
    const element = createHTMLElement({ tag: 'div' });

    expect(element.className).toBe('');
    expect(element.textContent).toBe('');
    expect(element.attributes).toHaveLength(0);
  });

  describe('classList', () => {
    it('applies a single class', () => {
      const element = createHTMLElement({ tag: 'div', classList: 'card' });

      expect(element.classList.contains('card')).toBe(true);
    });

    it('applies several space-separated classes', () => {
      const element = createHTMLElement({
        tag: 'div',
        classList: 'card card--active',
      });

      expect([...element.classList]).toEqual(['card', 'card--active']);
    });

    it('adds no class attribute when the value is an empty string', () => {
      const element = createHTMLElement({ tag: 'div', classList: '' });

      expect(element.hasAttribute('class')).toBe(false);
    });
  });

  describe('textContent', () => {
    it('sets the text', () => {
      const element = createHTMLElement({
        tag: 'h1',
        textContent: 'Game Library',
      });

      expect(element.textContent).toBe('Game Library');
    });

    it('treats markup as plain text instead of parsing it', () => {
      const element = createHTMLElement({
        tag: 'p',
        textContent: '<b>bold</b>',
      });

      expect(element.textContent).toBe('<b>bold</b>');
      expect(element.querySelector('b')).toBeNull();
    });

    it('leaves the element empty when the text is an empty string', () => {
      const element = createHTMLElement({ tag: 'p', textContent: '' });

      expect(element.textContent).toBe('');
      expect(element.childNodes).toHaveLength(0);
    });
  });

  describe('attributes', () => {
    it('sets a single attribute', () => {
      const element = createHTMLElement({
        tag: 'a',
        attributes: [['href', '/library']],
      });

      expect(element.getAttribute('href')).toBe('/library');
    });

    it('sets several attributes', () => {
      const element = createHTMLElement({
        tag: 'a',
        attributes: [
          ['href', '#'],
          ['data-page', 'library'],
          ['aria-label', 'Open library'],
        ],
      });

      expect(element.getAttribute('href')).toBe('#');
      expect(element.dataset.page).toBe('library');
      expect(element.getAttribute('aria-label')).toBe('Open library');
    });

    it('lets the last value win when an attribute is repeated', () => {
      const element = createHTMLElement({
        tag: 'div',
        attributes: [
          ['data-state', 'old'],
          ['data-state', 'new'],
        ],
      });

      expect(element.dataset.state).toBe('new');
    });
  });

  it('combines classes, text and attributes', () => {
    const link = createHTMLElement({
      tag: 'a',
      classList: 'nav__link nav__link--active',
      textContent: 'Library',
      attributes: [['data-page', 'library']],
    });

    expect(link.outerHTML).toBe(
      '<a class="nav__link nav__link--active" data-page="library">Library</a>',
    );
  });

  it('creates a new element on every call', () => {
    const first = createHTMLElement({ tag: 'div' });
    const second = createHTMLElement({ tag: 'div' });

    expect(first).not.toBe(second);
  });
});
