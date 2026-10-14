import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

interface FakeQuery {
  media: string;
  matches: boolean;
  listeners: (() => void)[];
  addEventListener: (type: string, listener: () => void) => void;
}

// jsdom has no matchMedia, so tests control the screen size through this fake
const createViewport = () => {
  let isNarrow = false;
  let queries: FakeQuery[] = [];

  const matchMedia = vi.fn((query: string): FakeQuery => {
    const listeners: (() => void)[] = [];
    const fake: FakeQuery = {
      media: query,
      matches: isNarrow,
      listeners,
      addEventListener: (_type, listener) => {
        listeners.push(listener);
      },
    };
    queries.push(fake);
    return fake;
  });

  return {
    matchMedia,
    reset: () => {
      isNarrow = false;
      queries = [];
      matchMedia.mockClear();
    },
    resizeTo: (isNarrowScreen: boolean) => {
      isNarrow = isNarrowScreen;
      const existing = [...queries];
      for (const query of existing) {
        query.matches = isNarrowScreen;
        const listeners = [...query.listeners];
        for (const listener of listeners) listener();
      }
    },
  };
};

const viewport = createViewport();

const scrollTo = vi.fn();

// the module keeps its elements at module level, so every test gets a fresh copy
const load = async () => {
  const paginationModule = await import('./pagination');
  const parametersModule =
    await import('../../../api/fetch-games/fetch-games-parameters');
  return { ...paginationModule, ...parametersModule };
};

const setup = async (current = 1, total = 1) => {
  const loaded = await load();
  const updateUI = vi.fn<() => Promise<void>>(() => Promise.resolve());
  const root = loaded.pagination(updateUI);
  loaded.updatePage(current);
  loaded.updatePagination(current, total);
  return { ...loaded, root, updateUI };
};

const pageButtons = (root: HTMLElement) => [
  ...root.querySelectorAll<HTMLButtonElement>('.pagination_button--page'),
];

const labels = (root: HTMLElement) =>
  pageButtons(root).map((button) => button.textContent);

const currentLabels = (root: HTMLElement) =>
  pageButtons(root)
    .filter((button) => button.getAttribute('aria-current') === 'page')
    .map((button) => button.textContent);

const pageButton = (root: HTMLElement, page: number) =>
  root.querySelector(
    `.pagination_button--page[data-page="${CSS.escape(page.toString())}"]`,
  ) as HTMLButtonElement;

const arrow = (root: HTMLElement, direction: string) =>
  root.querySelector(
    `[data-direction="${CSS.escape(direction)}"]`,
  ) as HTMLButtonElement;

describe('pagination', () => {
  beforeEach(() => {
    vi.resetModules();
    viewport.reset();
    scrollTo.mockClear();
    vi.stubGlobal('matchMedia', viewport.matchMedia);
    vi.stubGlobal('scrollTo', scrollTo);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('structure', () => {
    it('renders a labelled pagination with arrows around the page numbers', async () => {
      const { pagination } = await load();
      const root = pagination(vi.fn(() => Promise.resolve()));

      expect(root.tagName).toBe('DIV');
      expect(root.classList.contains('pagination')).toBe(true);
      expect(root.getAttribute('aria-label')).toBe('pagination');
      expect([...root.children].map((child) => child.className)).toEqual([
        'pagination_button pagination_button--arrow',
        'pagination_container',
        'pagination_button pagination_button--arrow',
      ]);
    });

    it('starts with disabled previous and next arrows', async () => {
      const { pagination } = await load();
      const root = pagination(vi.fn(() => Promise.resolve()));

      expect(arrow(root, 'previous').textContent).toBe('<');
      expect(arrow(root, 'next').textContent).toBe('>');
      expect(arrow(root, 'previous').disabled).toBe(true);
      expect(arrow(root, 'next').disabled).toBe(true);
    });

    it('starts with page 1 marked as the current page', async () => {
      const { pagination } = await load();
      const root = pagination(vi.fn(() => Promise.resolve()));

      expect(labels(root)).toEqual(['1']);
      expect(currentLabels(root)).toEqual(['1']);
      expect(pageButton(root, 1).dataset.page).toBe('1');
    });
  });

  describe('updatePagination: a single page', () => {
    it.each([0, 1])(
      'shows only page 1 when there are %i pages',
      async (total) => {
        const { root } = await setup(1, total);

        expect(labels(root)).toEqual(['1']);
        expect(currentLabels(root)).toEqual(['1']);
        expect(pageButton(root, 1).dataset.page).toBe('1');
      },
    );

    it('disables both arrows', async () => {
      const { root } = await setup(1, 1);

      expect(arrow(root, 'previous').disabled).toBe(true);
      expect(arrow(root, 'next').disabled).toBe(true);
    });

    it('replaces the numbers shown before', async () => {
      const { root, updatePagination } = await setup(3, 5);

      updatePagination(1, 1);

      expect(labels(root)).toEqual(['1']);
    });
  });

  describe('updatePagination: which pages are shown on a wide screen', () => {
    it.each([
      [1, 3, ['1', '2', '3']],
      [2, 4, ['1', '2', '3', '4']],
      [1, 10, ['1', '2', '3', '4']],
      [2, 10, ['1', '2', '3', '4']],
      [3, 10, ['2', '3', '4', '5']],
      [5, 10, ['4', '5', '6', '7']],
      [9, 10, ['7', '8', '9', '10']],
      [10, 10, ['7', '8', '9', '10']],
    ])('on page %i of %i it shows %j', async (current, total, expected) => {
      const { root } = await setup(current, total);

      expect(labels(root)).toEqual(expected);
    });

    it('marks only the current page', async () => {
      const { root } = await setup(5, 10);

      expect(currentLabels(root)).toEqual(['5']);
    });

    it('gives every number button its page in data-page', async () => {
      const { root } = await setup(5, 10);

      const pages = pageButtons(root).map((button) => button.dataset.page);
      expect(pages).toEqual(['4', '5', '6', '7']);
    });
  });

  describe('updatePagination: which pages are shown on a narrow screen', () => {
    beforeEach(() => {
      viewport.resizeTo(true);
    });

    it.each([
      [1, 10, ['1', '2', '3']],
      [2, 10, ['1', '2', '3']],
      [5, 10, ['4', '5', '6']],
      [10, 10, ['8', '9', '10']],
      [3, 3, ['1', '2', '3']],
      [1, 2, ['1', '2']],
    ])('on page %i of %i it shows %j', async (current, total, expected) => {
      const { root } = await setup(current, total);

      expect(labels(root)).toEqual(expected);
    });

    it('asks for the 425px breakpoint', async () => {
      await setup(5, 10);

      expect(viewport.matchMedia).toHaveBeenCalledWith('(max-width: 425px)');
    });
  });

  describe('updatePagination: the arrows', () => {
    it.each([
      [1, 5, true, false],
      [3, 5, false, false],
      [5, 5, false, true],
    ])(
      'on page %i of %i: previous disabled is %s, next disabled is %s',
      async (current, total, previousDisabled, nextDisabled) => {
        const { root } = await setup(current, total);

        expect(arrow(root, 'previous').disabled).toBe(previousDisabled);
        expect(arrow(root, 'next').disabled).toBe(nextDisabled);
      },
    );

    it('enables the arrows again after a single-page state', async () => {
      const { root, updatePagination } = await setup(1, 1);

      updatePagination(2, 5);

      expect(arrow(root, 'previous').disabled).toBe(false);
      expect(arrow(root, 'next').disabled).toBe(false);
    });
  });

  describe('updatePagination: changing the screen size', () => {
    it('shows fewer pages when the screen becomes narrow, around the same current page', async () => {
      const { root } = await setup(5, 10);
      expect(labels(root)).toEqual(['4', '5', '6', '7']);

      viewport.resizeTo(true);

      expect(labels(root)).toEqual(['4', '5', '6']);
      expect(currentLabels(root)).toEqual(['5']);
    });

    it('shows more pages again when the screen becomes wide', async () => {
      viewport.resizeTo(true);
      const { root } = await setup(5, 10);
      expect(labels(root)).toEqual(['4', '5', '6']);

      viewport.resizeTo(false);

      expect(labels(root)).toEqual(['4', '5', '6', '7']);
    });
  });

  describe('clicking', () => {
    it('goes to the chosen page, reloads the games and scrolls to the top', async () => {
      const { root, updateUI, parameters } = await setup(1, 5);

      pageButton(root, 3).click();

      expect(parameters.page).toBe(3);
      expect(updateUI).toHaveBeenCalledTimes(1);
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('goes to the next page with the next arrow', async () => {
      const { root, updateUI, parameters } = await setup(2, 5);

      arrow(root, 'next').click();

      expect(parameters.page).toBe(3);
      expect(updateUI).toHaveBeenCalledTimes(1);
      expect(scrollTo).toHaveBeenCalledTimes(1);
    });

    it('goes to the previous page with the previous arrow', async () => {
      const { root, updateUI, parameters } = await setup(3, 5);

      arrow(root, 'previous').click();

      expect(parameters.page).toBe(2);
      expect(updateUI).toHaveBeenCalledTimes(1);
    });

    it('updates the stored page before it reloads, so the request uses it', async () => {
      const { root, updateUI, parameters } = await setup(1, 5);
      let pageAtReload = 0;
      updateUI.mockImplementation(() => {
        pageAtReload = parameters.page;
        return Promise.resolve();
      });

      pageButton(root, 4).click();

      expect(pageAtReload).toBe(4);
    });

    it('does nothing when a disabled arrow is clicked', async () => {
      const { root, updateUI, parameters } = await setup(1, 5);

      arrow(root, 'previous').click();

      expect(parameters.page).toBe(1);
      expect(updateUI).not.toHaveBeenCalled();
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it('ignores a click on the container between the buttons', async () => {
      const { root, updateUI, parameters } = await setup(2, 5);

      (root.querySelector('.pagination_container') as HTMLElement).click();

      expect(parameters.page).toBe(2);
      expect(updateUI).not.toHaveBeenCalled();
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it('ignores a click on the pagination itself', async () => {
      const { root, updateUI } = await setup(2, 5);

      root.click();

      expect(updateUI).not.toHaveBeenCalled();
    });
  });
});
