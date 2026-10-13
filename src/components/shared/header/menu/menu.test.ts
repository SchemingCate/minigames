import { describe, it, expect } from 'vitest';
import { ButtonType } from '../../../../helpers/enums';
import type { PageId } from '../../../../helpers/types';
import { menu } from './menu';

const links = (root: HTMLElement) => [
  ...root.querySelectorAll<HTMLAnchorElement>(':scope nav a'),
];

const currentLinks = (root: HTMLElement) =>
  links(root).filter((link) => link.classList.contains('nav_link--current'));

const currentTexts = (root: HTMLElement) =>
  currentLinks(root).map((link) => link.textContent);

const buttons = (root: HTMLElement) => [
  ...(root.querySelector('.buttons') as HTMLElement).querySelectorAll('button'),
];

describe('menu', () => {
  describe('structure', () => {
    it('renders a menu with a navigation and a buttons area, in that order', () => {
      const root = menu('home');

      expect(root.classList.contains('menu')).toBe(true);
      expect([...root.children].map((child) => child.tagName)).toEqual([
        'NAV',
        'DIV',
      ]);
      expect(root.lastElementChild?.classList.contains('buttons')).toBe(true);
    });

    it('creates a new element on every call', () => {
      expect(menu('home')).not.toBe(menu('home'));
    });
  });

  describe('navigation links', () => {
    it('lists home, library, tournaments and community in order', () => {
      expect(links(menu('home')).map((link) => link.textContent)).toEqual([
        'home',
        'library',
        'tournaments',
        'community',
      ]);
    });

    it('puts every link in its own list item of one list', () => {
      const root = menu('home');
      const items = root.querySelectorAll(':scope ul.nav_list > li');

      expect(items).toHaveLength(4);
      for (const item of items) {
        expect(item.querySelectorAll('a.nav_link')).toHaveLength(1);
      }
    });

    it('gives each link the page id the router needs', () => {
      const pages = links(menu('home')).map((link) => link.dataset.page);

      expect(pages).toEqual(['home', 'library', 'home', 'home']);
    });

    it('uses "#" as the href so the router can handle the click', () => {
      const navLinks = links(menu('home'));

      expect(navLinks.length).toBeGreaterThan(0);
      for (const link of navLinks) {
        expect(link.getAttribute('href')).toBe('#');
      }
    });
  });

  describe('current page highlight', () => {
    it('highlights only "home" on the home page', () => {
      expect(currentTexts(menu('home'))).toEqual(['home']);
    });

    it('highlights only "library" on the library page', () => {
      expect(currentTexts(menu('library'))).toEqual(['library']);
    });

    it('never highlights the placeholder links, even though they point at home', () => {
      const root = menu('home');
      const placeholders = links(root).filter((link) =>
        ['tournaments', 'community'].includes(link.textContent),
      );

      expect(placeholders).toHaveLength(2);
      for (const link of placeholders) {
        expect(link.dataset.page).toBe('home');
        expect(link.classList.contains('nav_link--current')).toBe(false);
      }
    });

    it('highlights nothing for an unknown page', () => {
      expect(currentLinks(menu('settings' as PageId))).toHaveLength(0);
    });

    it('does not carry the highlight over between calls', () => {
      menu('library');

      expect(currentTexts(menu('home'))).toEqual(['home']);
    });
  });

  describe('buttons', () => {
    it('shows log in, sign up and burger in that order', () => {
      const [logIn, signUp, burger] = buttons(menu('home'));

      expect(buttons(menu('home'))).toHaveLength(3);
      expect(logIn.classList.contains('button_login')).toBe(true);
      expect(signUp.classList.contains('button_signup')).toBe(true);
      expect(burger.classList.contains('button_burger')).toBe(true);
    });

    it('labels the auth buttons', () => {
      const [logIn, signUp] = buttons(menu('home'));

      expect(logIn.textContent).toBe(ButtonType.LogIn);
      expect(signUp.textContent).toBe(ButtonType.SignUp);
    });

    it('wires both auth buttons to the auth dialog', () => {
      const [logIn, signUp] = buttons(menu('home'));

      for (const element of [logIn, signUp]) {
        expect(element.getAttribute('command')).toBe('show-modal');
        expect(element.getAttribute('commandfor')).toBe('auth');
      }
    });

    it('keeps the burger free of dialog commands', () => {
      const burger = buttons(menu('home'))[2];

      expect(burger.hasAttribute('command')).toBe(false);
    });
  });
});
