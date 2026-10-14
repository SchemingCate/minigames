import { describe, it, expect } from 'vitest';
import logoSvg from '../../../assets/logos/logo.svg';
import { logo } from './logo';

const titleOf = (root: HTMLElement) => root.querySelector('h1') as HTMLElement;

describe('logo', () => {
  it('renders a logo container with the image followed by the title', () => {
    const root = logo('dark');

    expect(root.tagName).toBe('DIV');
    expect(root.classList.contains('logo')).toBe(true);
    expect([...root.children].map((child) => child.tagName)).toEqual([
      'IMG',
      'H1',
    ]);
  });

  it('uses the logo asset as the image source', () => {
    const image = logo('dark').querySelector('img') as HTMLImageElement;

    expect(image.getAttribute('src')).toBe(logoSvg);
  });

  it('gives the image a descriptive alt text', () => {
    const image = logo('dark').querySelector('img') as HTMLImageElement;

    expect(image.getAttribute('alt')).toBe('MiniGames logo');
  });

  it('shows the site name as the title', () => {
    const title = titleOf(logo('dark'));

    expect(title.textContent).toBe('MiniGames');
    expect(title.classList.contains('logo_title')).toBe(true);
  });

  describe('variants', () => {
    it('adds the light modifier to the title for the light logo', () => {
      expect(
        titleOf(logo('light')).classList.contains('logo_title--light'),
      ).toBe(true);
    });

    it('leaves the title unmodified for the dark logo', () => {
      expect(titleOf(logo('dark')).className).toBe('logo_title');
    });

    it('keeps the variants independent of each other', () => {
      const light = logo('light');
      const dark = logo('dark');

      expect(titleOf(light).classList.contains('logo_title--light')).toBe(true);
      expect(titleOf(dark).classList.contains('logo_title--light')).toBe(false);
    });
  });

  it('creates a new element on every call', () => {
    expect(logo('dark')).not.toBe(logo('dark'));
  });
});
