import { describe, it, expect, beforeEach, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  updatePage: vi.fn<(page: number) => void>(),
  updateSort: vi.fn<(sort: string) => void>(),
}));

vi.mock('../../../api/fetch-games/fetch-games-parameters', () => ({
  updatePage: mocks.updatePage,
  updateSort: mocks.updateSort,
}));

import { sortDropdown } from './sort-dropdown';

const OPTION_IDS = ['rating-desc', 'rating-asc', 'name-asc', 'name-desc'];
const OPTION_LABELS = ['Rating ↑', 'Rating ↓', 'Name A→Z', 'Name Z→A'];

const build = () => {
  const updateUI = vi.fn<() => Promise<void>>(() => Promise.resolve());
  return { root: sortDropdown(updateUI), updateUI };
};

const trigger = (root: HTMLElement) =>
  root.querySelector('.sort_button') as HTMLButtonElement;

const list = (root: HTMLElement) =>
  root.querySelector('.sort_list') as HTMLElement;

const optionsOf = (root: HTMLElement) => [
  ...root.querySelectorAll<HTMLElement>('[role="option"]'),
];

const option = (root: HTMLElement, slug: string) =>
  root.querySelector(`#${slug}`) as HTMLElement;

const selectedIds = (root: HTMLElement) =>
  optionsOf(root)
    .filter((item) => item.getAttribute('aria-selected') === 'true')
    .map((item) => item.id);

// what a user does: open the list, then pick an option
const choose = (root: HTMLElement, slug: string) => {
  trigger(root).click();
  option(root, slug).click();
};

describe('sortDropdown', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('structure', () => {
    it('renders a wrapper with the button first and the list second', () => {
      const { root } = build();

      expect(root.tagName).toBe('DIV');
      expect(root.classList.contains('sort')).toBe(true);
      expect([...root.children].map((child) => child.className)).toEqual([
        'sort_button',
        'sort_list',
      ]);
    });

    it('renders a closed button that names the default sort', () => {
      const button = trigger(build().root);

      expect(button.tagName).toBe('BUTTON');
      expect(button.id).toBe('sort-button');
      expect(button.getAttribute('type')).toBe('button');
      expect(button.textContent).toBe('Sort by: Rating ↑');
      expect(button.getAttribute('aria-haspopup')).toBe('listbox');
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('renders a hidden listbox labelled by the button', () => {
      const { root } = build();

      expect(list(root).tagName).toBe('UL');
      expect(list(root).getAttribute('role')).toBe('listbox');
      expect(list(root).getAttribute('aria-labelledby')).toBe(trigger(root).id);
      expect(list(root).hidden).toBe(true);
    });

    it('offers the four sort options in order', () => {
      const { root } = build();

      expect(optionsOf(root).map((item) => item.id)).toEqual(OPTION_IDS);
      expect(optionsOf(root).map((item) => item.textContent)).toEqual(
        OPTION_LABELS,
      );
      for (const item of optionsOf(root)) {
        expect(item.tagName).toBe('LI');
        expect(item.classList.contains('sort_list_item')).toBe(true);
      }
    });

    it('selects only the rating option at first', () => {
      expect(selectedIds(build().root)).toEqual(['rating-desc']);
    });

    it('shows the selected option in the button label', () => {
      const { root } = build();
      const selected = optionsOf(root).find(
        (item) => item.getAttribute('aria-selected') === 'true',
      ) as HTMLElement;

      expect(trigger(root).textContent).toBe(
        `Sort by: ${selected.textContent}`,
      );
    });

    it('does not touch the parameters or reload on its own', () => {
      const { updateUI } = build();

      expect(mocks.updatePage).not.toHaveBeenCalled();
      expect(mocks.updateSort).not.toHaveBeenCalled();
      expect(updateUI).not.toHaveBeenCalled();
    });
  });

  describe('opening and closing', () => {
    it('opens the list when the button is clicked', () => {
      const { root } = build();

      trigger(root).click();

      expect(trigger(root).getAttribute('aria-expanded')).toBe('true');
      expect(list(root).hidden).toBe(false);
    });

    it('closes the list when the button is clicked again', () => {
      const { root } = build();

      trigger(root).click();
      trigger(root).click();

      expect(trigger(root).getAttribute('aria-expanded')).toBe('false');
      expect(list(root).hidden).toBe(true);
    });

    it('closes the list after an option is chosen', () => {
      const { root } = build();

      choose(root, 'name-asc');

      expect(trigger(root).getAttribute('aria-expanded')).toBe('false');
      expect(list(root).hidden).toBe(true);
    });

    it('does not reload or change the sort just by opening', () => {
      const { root, updateUI } = build();

      trigger(root).click();

      expect(updateUI).not.toHaveBeenCalled();
      expect(mocks.updateSort).not.toHaveBeenCalled();
    });

    it('ignores a click on the wrapper itself', () => {
      const { root } = build();

      root.click();

      expect(trigger(root).getAttribute('aria-expanded')).toBe('false');
      expect(list(root).hidden).toBe(true);
    });

    it('ignores a click on the list outside the options', () => {
      const { root } = build();
      trigger(root).click();

      list(root).click();

      expect(trigger(root).getAttribute('aria-expanded')).toBe('true');
      expect(list(root).hidden).toBe(false);
    });

    it('keeps two dropdowns independent', () => {
      const first = build();
      const second = build();

      trigger(first.root).click();

      expect(list(first.root).hidden).toBe(false);
      expect(list(second.root).hidden).toBe(true);
    });
  });

  describe('choosing an option', () => {
    it('selects the chosen option and deselects the previous one', () => {
      const { root } = build();

      choose(root, 'name-asc');

      expect(selectedIds(root)).toEqual(['name-asc']);
      expect(option(root, 'rating-desc').getAttribute('aria-selected')).toBe(
        'false',
      );
    });

    it('shows the chosen option in the button label', () => {
      const { root } = build();

      choose(root, 'name-desc');

      expect(trigger(root).textContent).toBe('Sort by: Name Z→A');
    });

    it('goes back to page 1, stores the sort and reloads the games', () => {
      const { root, updateUI } = build();

      choose(root, 'name-asc');

      expect(mocks.updatePage).toHaveBeenCalledTimes(1);
      expect(mocks.updatePage).toHaveBeenCalledWith(1);
      expect(mocks.updateSort).toHaveBeenCalledTimes(1);
      expect(mocks.updateSort).toHaveBeenCalledWith('name-asc');
      expect(updateUI).toHaveBeenCalledTimes(1);
    });

    it('updates the parameters before it reloads, so the request uses them', () => {
      const { root, updateUI } = build();

      choose(root, 'rating-asc');

      const pageOrder = mocks.updatePage.mock.invocationCallOrder[0];
      const sortOrder = mocks.updateSort.mock.invocationCallOrder[0];
      const reloadOrder = updateUI.mock.invocationCallOrder[0];
      expect(pageOrder).toBeLessThan(reloadOrder);
      expect(sortOrder).toBeLessThan(reloadOrder);
    });

    it('keeps exactly one option selected after several choices', () => {
      const { root } = build();

      choose(root, 'name-asc');
      choose(root, 'rating-asc');

      expect(selectedIds(root)).toEqual(['rating-asc']);
      expect(trigger(root).textContent).toBe('Sort by: Rating ↓');
      expect(mocks.updateSort.mock.calls.map(([sort]) => sort)).toEqual([
        'name-asc',
        'rating-asc',
      ]);
    });

    it('can go back to the default option', () => {
      const { root } = build();

      choose(root, 'name-asc');
      choose(root, 'rating-desc');

      expect(selectedIds(root)).toEqual(['rating-desc']);
      expect(trigger(root).textContent).toBe('Sort by: Rating ↑');
      expect(mocks.updateSort).toHaveBeenLastCalledWith('rating-desc');
    });

    it('keeps the option selected when it is chosen again', () => {
      const { root } = build();

      choose(root, 'name-asc');
      choose(root, 'name-asc');

      expect(selectedIds(root)).toEqual(['name-asc']);
      expect(trigger(root).textContent).toBe('Sort by: Name A→Z');
    });

    it('keeps the selection of one dropdown apart from the other', () => {
      const first = build();
      const second = build();

      choose(first.root, 'name-desc');

      expect(selectedIds(first.root)).toEqual(['name-desc']);
      expect(selectedIds(second.root)).toEqual(['rating-desc']);
      expect(second.updateUI).not.toHaveBeenCalled();
    });
  });
});
