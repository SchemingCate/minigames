import { describe, it, expect } from 'vitest';
import type { PageId } from '../../../helpers/types';
import { header } from './header';

const render = (page: PageId) => header(page) as HTMLElement;

const container = (root: HTMLElement) => root.firstElementChild as HTMLElement;

const currentTexts = (root: HTMLElement) =>
  [...root.querySelectorAll('.nav_link--current')].map(
    (link) => link.textContent,
  );

describe('header', () => {
  describe('structure', () => {
    it('renders a header element with a single container', () => {
      const root = render('home');

      expect(root.tagName).toBe('HEADER');
      expect(root.classList.contains('header')).toBe(true);
      expect(root.children).toHaveLength(1);
      expect(container(root).classList.contains('header_container')).toBe(true);
    });

    it('puts the logo first and the menu second inside the container', () => {
      const children = [...container(render('home')).children];

      expect(children).toHaveLength(2);
      expect(children[0].classList.contains('logo')).toBe(true);
      expect(children[1].classList.contains('menu')).toBe(true);
    });

    it('creates a new element on every call', () => {
      expect(render('home')).not.toBe(render('home'));
    });
  });

  describe('logo', () => {
    it('uses the dark variant', () => {
      const title = render('home').querySelector('.logo_title') as HTMLElement;

      expect(title.classList.contains('logo_title--light')).toBe(false);
    });
  });

  describe('page argument', () => {
    it('passes "home" to the menu', () => {
      expect(currentTexts(render('home'))).toEqual(['home']);
    });

    it('passes "library" to the menu', () => {
      expect(currentTexts(render('library'))).toEqual(['library']);
    });

    it('does not keep the previous page between calls', () => {
      render('library');

      expect(currentTexts(render('home'))).toEqual(['home']);
    });

    it('highlights nothing for an unknown page and still renders', () => {
      const root = render('settings' as PageId);

      expect(root.querySelector('.menu')).not.toBeNull();
      expect(currentTexts(root)).toHaveLength(0);
    });
  });
});
