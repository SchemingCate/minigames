import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { CategoriesResponse } from '../../../helpers/interfaces';

const mocks = vi.hoisted(() => ({
  fetchCategories: vi.fn<() => Promise<CategoriesResponse>>(),
  snackbar: vi.fn<(type: string, message: string) => void>(),
  updateCategory: vi.fn<(category: string) => void>(),
  updatePage: vi.fn<(page: number) => void>(),
}));

vi.mock('../../../api/fetch-categories', () => ({
  fetchCategories: mocks.fetchCategories,
}));
vi.mock('../../shared/snackbar/snackbar', () => ({ snackbar: mocks.snackbar }));
vi.mock('../../../api/fetch-games/fetch-games-parameters', () => ({
  updateCategory: mocks.updateCategory,
  updatePage: mocks.updatePage,
}));

import { filterChips } from './filter-chips';

const categories = () =>
  ({
    data: [
      { slug: 'all', label: 'All Games', isDefault: true },
      { slug: 'puzzle', label: 'Puzzle', isDefault: false },
      { slug: 'arcade', label: 'Arcade', isDefault: false },
    ],
  }) as unknown as CategoriesResponse;

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

const build = () => {
  const updateUI = vi.fn<() => Promise<void>>(() => Promise.resolve());
  return { root: filterChips(updateUI), updateUI };
};

const render = async () => {
  const built = build();
  await flush();
  return built;
};

const chipsOf = (root: HTMLElement) => [
  ...root.querySelectorAll<HTMLElement>('.chips_item'),
];

const chip = (root: HTMLElement, slug: string) =>
  root.querySelector(`[data-category="${CSS.escape(slug)}"]`) as HTMLElement;

const activeSlugs = (root: HTMLElement) =>
  chipsOf(root)
    .filter((item) => item.classList.contains('chips_item--active'))
    .map((item) => item.dataset.category);

describe('filterChips', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.fetchCategories.mockResolvedValue(categories());
  });

  describe('structure', () => {
    it('renders an accessible radio group', async () => {
      const { root } = await render();

      expect(root.tagName).toBe('DIV');
      expect(root.classList.contains('chips')).toBe(true);
      expect(root.getAttribute('role')).toBe('radiogroup');
      expect(root.getAttribute('aria-label')).toBe('filter by game type');
    });

    it('is empty until the categories have arrived', async () => {
      mocks.fetchCategories.mockReturnValue(
        new Promise<CategoriesResponse>(() => {}),
      );

      const { root } = await render();

      expect(root.children).toHaveLength(0);
      expect(mocks.snackbar).not.toHaveBeenCalled();
    });
  });

  describe('loading the categories', () => {
    it('requests the categories once', async () => {
      await render();

      expect(mocks.fetchCategories).toHaveBeenCalledTimes(1);
    });

    it('renders a chip for every category, in order', async () => {
      const { root } = await render();

      expect(chipsOf(root).map((item) => item.textContent)).toEqual([
        'All Games',
        'Puzzle',
        'Arcade',
      ]);
      expect(chipsOf(root).map((item) => item.dataset.category)).toEqual([
        'all',
        'puzzle',
        'arcade',
      ]);
    });

    it('makes every chip a radio button that does not submit forms', async () => {
      const { root } = await render();

      for (const item of chipsOf(root)) {
        expect(item.tagName).toBe('BUTTON');
        expect(item.getAttribute('type')).toBe('button');
        expect(item.getAttribute('role')).toBe('radio');
      }
    });

    it('selects only the default category', async () => {
      const { root } = await render();

      expect(activeSlugs(root)).toEqual(['all']);
      expect(chip(root, 'all').getAttribute('aria-checked')).toBe('true');
      expect(chip(root, 'puzzle').getAttribute('aria-checked')).toBe('false');
      expect(chip(root, 'arcade').getAttribute('aria-checked')).toBe('false');
    });

    it('reports success', async () => {
      await render();

      expect(mocks.snackbar).toHaveBeenCalledTimes(1);
      expect(mocks.snackbar).toHaveBeenCalledWith(
        'success',
        'Success: Categories loaded',
      );
    });

    it('reports an error and shows no chips when loading fails', async () => {
      mocks.fetchCategories.mockRejectedValue(new Error('network down'));

      const { root } = await render();

      expect(root.children).toHaveLength(0);
      expect(mocks.snackbar).toHaveBeenCalledTimes(1);
      expect(mocks.snackbar).toHaveBeenCalledWith(
        'error',
        'Error: failed to load categories',
      );
    });
  });

  describe('choosing a chip', () => {
    it('selects the chosen chip and deselects the previous one', async () => {
      const { root } = await render();

      chip(root, 'puzzle').click();

      expect(activeSlugs(root)).toEqual(['puzzle']);
      expect(chip(root, 'puzzle').getAttribute('aria-checked')).toBe('true');
      expect(chip(root, 'all').getAttribute('aria-checked')).toBe('false');
    });

    it('keeps exactly one chip selected after several choices', async () => {
      const { root } = await render();

      chip(root, 'puzzle').click();
      chip(root, 'arcade').click();
      chip(root, 'all').click();

      expect(activeSlugs(root)).toEqual(['all']);
      expect(
        chipsOf(root).filter(
          (item) => item.getAttribute('aria-checked') === 'true',
        ),
      ).toHaveLength(1);
    });

    it('keeps the chip selected when it is chosen again', async () => {
      const { root } = await render();

      chip(root, 'all').click();

      expect(activeSlugs(root)).toEqual(['all']);
      expect(chip(root, 'all').getAttribute('aria-checked')).toBe('true');
    });

    it('stores the category, goes back to page 1 and reloads the games', async () => {
      const { root, updateUI } = await render();

      chip(root, 'puzzle').click();

      expect(mocks.updateCategory).toHaveBeenCalledTimes(1);
      expect(mocks.updateCategory).toHaveBeenCalledWith('puzzle');
      expect(mocks.updatePage).toHaveBeenCalledTimes(1);
      expect(mocks.updatePage).toHaveBeenCalledWith(1);
      expect(updateUI).toHaveBeenCalledTimes(1);
    });

    it('updates the parameters before it reloads, so the request uses them', async () => {
      const { root, updateUI } = await render();

      chip(root, 'arcade').click();

      const categoryOrder = mocks.updateCategory.mock.invocationCallOrder[0];
      const pageOrder = mocks.updatePage.mock.invocationCallOrder[0];
      const reloadOrder = updateUI.mock.invocationCallOrder[0];
      expect(categoryOrder).toBeLessThan(pageOrder);
      expect(pageOrder).toBeLessThan(reloadOrder);
    });

    it('treats a click on something inside the chip as a click on the chip', async () => {
      const { root, updateUI } = await render();
      const inner = document.createElement('span');
      chip(root, 'puzzle').append(inner);

      inner.click();

      expect(activeSlugs(root)).toEqual(['puzzle']);
      expect(updateUI).toHaveBeenCalledTimes(1);
    });
  });

  describe('clicks that must be ignored', () => {
    it('ignores a click on the group itself', async () => {
      const { root, updateUI } = await render();

      root.click();

      expect(activeSlugs(root)).toEqual(['all']);
      expect(mocks.updateCategory).not.toHaveBeenCalled();
      expect(mocks.updatePage).not.toHaveBeenCalled();
      expect(updateUI).not.toHaveBeenCalled();
    });

    it('ignores a click on an element that is not a chip', async () => {
      const { root, updateUI } = await render();
      const stray = document.createElement('div');
      root.append(stray);

      stray.click();

      expect(updateUI).not.toHaveBeenCalled();
    });
  });

  describe('building it more than once', () => {
    it('gives every build its own element with its own chips', async () => {
      const first = build();
      const second = build();
      await flush();

      expect(first.root).not.toBe(second.root);
      expect(chipsOf(first.root)).toHaveLength(3);
      expect(chipsOf(second.root)).toHaveLength(3);
    });

    it('reacts once per click', async () => {
      build();
      const { root } = build();
      await flush();

      chip(root, 'puzzle').click();

      expect(mocks.updateCategory).toHaveBeenCalledTimes(1);
      expect(mocks.updatePage).toHaveBeenCalledTimes(1);
    });

    it('reloads only through the function each build was given', async () => {
      const first = build();
      const second = build();
      await flush();

      chip(second.root, 'puzzle').click();

      expect(second.updateUI).toHaveBeenCalledTimes(1);
      expect(first.updateUI).not.toHaveBeenCalled();
    });

    it('keeps the selection of one build apart from the other', async () => {
      const first = build();
      const second = build();
      await flush();

      chip(second.root, 'arcade').click();

      expect(activeSlugs(second.root)).toEqual(['arcade']);
      expect(activeSlugs(first.root)).toEqual(['all']);
    });
  });
});
