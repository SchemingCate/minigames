import { describe, it, expect } from 'vitest';
import { footer } from './footer';

const section = (root: HTMLElement, name: string) =>
  root.querySelector(`.link-list--${name}`) as HTMLElement;

const linkTexts = (list: HTMLElement) =>
  [...list.querySelectorAll('a')].map((link) => link.textContent);

const linkByText = (root: HTMLElement, text: string) =>
  [...root.querySelectorAll('a')].find(
    (link) => link.textContent === text,
  ) as HTMLAnchorElement;

describe('footer', () => {
  describe('structure', () => {
    it('renders a footer element with a top and a bottom part', () => {
      const root = footer();

      expect(root.tagName).toBe('FOOTER');
      expect(root.classList.contains('footer')).toBe(true);
      expect([...root.children].map((child) => child.className)).toEqual([
        'footer_top',
        'footer_bottom',
      ]);
    });

    it('creates a new element on every call', () => {
      expect(footer()).not.toBe(footer());
    });
  });

  describe('description block', () => {
    it('starts with the light logo', () => {
      const block = footer().querySelector('.game-description') as HTMLElement;
      const logo = block.firstElementChild as HTMLElement;

      expect(logo.classList.contains('logo')).toBe(true);
      expect(
        logo
          .querySelector('.logo_title')
          ?.classList.contains('logo_title--light'),
      ).toBe(true);
    });

    it('shows the description after the logo', () => {
      const block = footer().querySelector('.game-description') as HTMLElement;

      expect(block.lastElementChild?.tagName).toBe('P');
      expect(block.lastElementChild?.textContent).toContain(
        'casual mini-games',
      );
    });
  });

  describe('link sections', () => {
    it('renders explore, company and community in order', () => {
      const headings = [...footer().querySelectorAll('h3.link-heading')].map(
        (heading) => heading.textContent,
      );

      expect(headings).toEqual(['explore', 'company', 'community']);
    });

    it('lists the links of each section in order', () => {
      const root = footer();

      expect(linkTexts(section(root, 'explore'))).toEqual([
        'home',
        'library',
        'categories',
        'tournaments',
      ]);
      expect(linkTexts(section(root, 'company'))).toEqual([
        'about us',
        'contact',
        'privacy policy',
        'terms of service',
      ]);
    });

    it('puts every link in its own list item', () => {
      const root = footer();

      for (const name of ['explore', 'company', 'community']) {
        const list = section(root, name);
        expect(list.querySelectorAll(':scope li > a.footer_link')).toHaveLength(
          list.querySelectorAll('li').length,
        );
      }
    });
  });

  describe('navigation links', () => {
    it('sends "home" and "library" to their own pages', () => {
      const root = footer();

      expect(linkByText(root, 'home').dataset.page).toBe('home');
      expect(linkByText(root, 'library').dataset.page).toBe('library');
    });

    it.each([
      'categories',
      'tournaments',
      'about us',
      'contact',
      'privacy policy',
      'terms of service',
    ])(
      'keeps the placeholder link "%s" on the home page without leaving it',
      (text) => {
        const link = linkByText(footer(), text);

        expect(link.dataset.page).toBe('home');
        expect(link.getAttribute('href')).toBe('#');
      },
    );

    it('gives every link in the top part a data-page attribute for the router', () => {
      const links = footer().querySelectorAll(
        ':scope .footer_top .footer_link',
      );

      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect((link as HTMLElement).dataset.page).toBeTruthy();
      }
    });
  });

  describe('community icon links', () => {
    it.each(['share', 'messages', 'rss'])(
      'shows "%s" as an icon with an accessible label',
      (name) => {
        const link = [
          ...section(footer(), 'community').querySelectorAll('a'),
        ].find(
          (anchor) => anchor.getAttribute('aria-label') === name,
        ) as HTMLAnchorElement;
        const icon = link.querySelector('span.footer_link_logo');

        expect(link.textContent).toBe('');
        expect(icon).not.toBeNull();
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
      },
    );

    it('uses icons only in the community section', () => {
      const root = footer();

      expect(
        section(root, 'explore').querySelector('.footer_link_logo'),
      ).toBeNull();
      expect(
        section(root, 'company').querySelector('.footer_link_logo'),
      ).toBeNull();
      expect(
        section(root, 'community').querySelectorAll('.footer_link_logo'),
      ).toHaveLength(3);
    });
  });

  describe('bottom bar', () => {
    it('shows the copyright notice', () => {
      const bottom = footer().querySelector('.footer_bottom') as HTMLElement;

      expect(bottom.textContent).toMatch(
        /© \d{4} MiniGames\. All rights reserved\./,
      );
    });

    it('links to RS School in a new tab', () => {
      const link = footer().querySelector(
        '.bottom-link--rs',
      ) as HTMLAnchorElement;

      expect(link.textContent).toBe('RS School');
      expect(link.getAttribute('href')).toBe(
        'https://rs.school/courses/short-track',
      );
      expect(link.getAttribute('target')).toBe('_blank');
    });

    it('links to the author GitHub profile in a new tab', () => {
      const link = footer().querySelector(
        '.bottom-link--github',
      ) as HTMLAnchorElement;

      expect(link.textContent).toBe('@SchemingCate');
      expect(link.getAttribute('href')).toBe('https://github.com/SchemingCate');
      expect(link.getAttribute('target')).toBe('_blank');
    });

    it('ends with the design credit', () => {
      const bottom = footer().querySelector('.footer_bottom') as HTMLElement;

      expect(bottom.lastElementChild?.textContent).toBe('Designed with love');
    });
  });
});
