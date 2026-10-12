import { describe, it, expect, vi } from 'vitest';

vi.mock('../../components/shared/header/header', () => ({
  header: vi.fn((active: string) =>
    Object.assign(document.createElement('header'), { id: `header-${active}` }),
  ),
}));
vi.mock('../../components/for-home-page/hero/hero', () => ({
  hero: vi.fn(() =>
    Object.assign(document.createElement('section'), { id: 'hero' }),
  ),
}));
vi.mock('../../components/for-home-page/leaderboard/leaderboard', () => ({
  leaderboard: vi.fn(() =>
    Object.assign(document.createElement('section'), { id: 'leaderboard' }),
  ),
}));
vi.mock('../../components/shared/footer/footer', () => ({
  footer: vi.fn(() =>
    Object.assign(document.createElement('footer'), { id: 'footer' }),
  ),
}));

import { header } from '../../components/shared/header/header';
import { homePage } from './home-page';

describe('homePage', () => {
  it('renders header, hero, leaderboard and footer in that order', () => {
    const page = homePage() as HTMLElement;

    const ids = [...page.children].map((child) => child.id);
    expect(ids).toEqual(['header-home', 'hero', 'leaderboard', 'footer']);
  });

  it('marks "home" as the active page in the header', () => {
    homePage();

    expect(header).toHaveBeenCalledWith('home');
  });

  it('builds a fresh page on every call', () => {
    const first = homePage();
    const second = homePage();

    expect(first).not.toBe(second);
  });
});
