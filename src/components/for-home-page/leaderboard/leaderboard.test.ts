import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  heading: vi.fn((text: string) => {
    const element = document.createElement('h2');
    element.textContent = text;
    return element;
  }),
}));

vi.mock('../../shared/heading/heading', () => ({ heading: mocks.heading }));

import { leaderboard } from './leaderboard';

const bodyRows = (root: HTMLElement): HTMLTableRowElement[] => [
  ...root.querySelectorAll<HTMLTableRowElement>(':scope tbody tr'),
];

const cellsOf = (row: HTMLTableRowElement): HTMLTableCellElement[] => [
  ...row.querySelectorAll<HTMLTableCellElement>('td'),
];

const column = (root: HTMLElement, index: number): HTMLTableCellElement[] =>
  bodyRows(root).map((row) => cellsOf(row)[index]);

const columnTexts = (root: HTMLElement, index: number): string[] =>
  column(root, index).map((cell) => cell.textContent);

const texts = (cells: HTMLElement[]): string[] =>
  cells.map((cell) => cell.textContent);

const headers = (root: HTMLElement): HTMLTableCellElement[] => [
  ...root.querySelectorAll<HTMLTableCellElement>(':scope thead th'),
];

const headersText = (root: HTMLElement) => {
  return texts(headers(root));
};

const digitsOnly = (value: string): number =>
  Number(value.replaceAll(/\D/g, ''));

describe('leaderboard', () => {
  beforeEach(() => {
    mocks.heading.mockClear();
  });

  it('wraps a section with the heading followed by the table', () => {
    const root = leaderboard();
    const section = root.firstElementChild as HTMLElement;

    expect(root.tagName).toBe('DIV');
    expect(root.classList.contains('wrapper')).toBe(true);
    expect(section.tagName).toBe('SECTION');
    expect(section.firstElementChild?.tagName).toBe('H2');
    expect(section.lastElementChild?.tagName).toBe('TABLE');
    expect(section.lastElementChild?.classList.contains('table')).toBe(true);
  });

  it('asks the heading component for the weekly title', () => {
    const root = leaderboard();

    expect(mocks.heading).toHaveBeenCalledTimes(1);
    expect(mocks.heading).toHaveBeenCalledWith('Top players this week');
    expect(root.querySelector('h2')?.textContent).toBe('Top players this week');
  });

  it('renders the column headers in order', () => {
    expect(headersText(leaderboard())).toEqual([
      'Rank',
      'Player',
      'Games',
      'Total score',
      'Streak',
      'Favorite game',
    ]);
  });

  it('marks only the Games and Favorite game headers with a data-row hook', () => {
    const hooks = headers(leaderboard()).map((header) => header.dataset.row);

    expect(hooks).toEqual([
      undefined,
      undefined,
      'games',
      undefined,
      undefined,
      'favgames',
    ]);
  });

  it('renders one body row per player, each with six cells', () => {
    const rows = bodyRows(leaderboard());

    expect(rows).toHaveLength(5);

    for (const row of rows) {
      expect(row.classList.contains('table_row')).toBe(true);
      expect(cellsOf(row)).toHaveLength(6);
    }
  });

  it('numbers the ranks from #1 to #5 in order', () => {
    expect(columnTexts(leaderboard(), 0)).toEqual([
      '#1',
      '#2',
      '#3',
      '#4',
      '#5',
    ]);
  });

  it('shows the player names', () => {
    expect(columnTexts(leaderboard(), 1)).toEqual([
      'Alex_Pro99',
      'CozyGamer_x',
      'MatchMaster',
      'BubblePop',
      'SudokuGod',
    ]);
  });

  it('shows the games played as plain numbers', () => {
    expect(columnTexts(leaderboard(), 2)).toEqual([
      '142',
      '118',
      '98',
      '87',
      '74',
    ]);
  });

  it('formats the total score as a number with thousands grouping', () => {
    const scores = texts(column(leaderboard(), 3));

    expect(scores.map((score) => digitsOnly(score))).toEqual([
      94_250, 81_400, 72_110, 65_900, 59_320,
    ]);

    for (const score of scores) {
      expect(score).not.toMatch(/^\d+$/);
    }
  });

  it('shows the streak with a fire icon and a streak class', () => {
    const cells = column(leaderboard(), 4);

    expect(texts(cells)).toEqual(['🔥 12', '🔥 8', '🔥 5', '🔥 3', '🔥 2']);

    for (const cell of cells) {
      expect(cell.classList.contains('info_streak')).toBe(true);
    }
  });

  it('shows the favorite game names', () => {
    expect(columnTexts(leaderboard(), 5)).toEqual([
      'Heartopia',
      'Cat Mail Co.',
      'Tiny Glade',
      'Whisper of the House',
      'Cat Chess',
    ]);
  });

  it('puts data-row hooks on the Games and Favorite game cells only', () => {
    const rows = bodyRows(leaderboard());

    for (const row of rows) {
      expect(cellsOf(row).map((cell) => cell.dataset.row)).toEqual([
        undefined,
        undefined,
        'games',
        undefined,
        undefined,
        'favgames',
      ]);
    }
  });

  it('lists players from the highest score to the lowest', () => {
    const scores = column(leaderboard(), 3).map((cell) =>
      digitsOnly(cell.textContent),
    );

    expect(scores).toEqual(scores.toSorted((a, b) => b - a));
  });

  it('builds a new independent element on every call', () => {
    const first = leaderboard();
    const second = leaderboard();

    expect(first).not.toBe(second);
    expect(first.outerHTML).toBe(second.outerHTML);

    first.remove();
    expect(bodyRows(second)).toHaveLength(5);
  });
});
