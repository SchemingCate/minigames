import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { snackbar, snackbarContainer } from './snackbar';

const AUTO_CLOSE_MS = 5000;

const items = (): HTMLElement[] => [
  ...snackbarContainer.querySelectorAll<HTMLElement>('.snackbar'),
];

const closeButtonOf = (item: HTMLElement): HTMLButtonElement =>
  item.querySelector('button') as HTMLButtonElement;

const messageOf = (item: HTMLElement): string =>
  item.querySelector('.snackbar_message')?.textContent ?? '';

describe('snackbarContainer', () => {
  it('is a manual popover container', () => {
    expect(snackbarContainer.tagName).toBe('DIV');
    expect(snackbarContainer.classList.contains('snackbars')).toBe(true);
    expect(snackbarContainer.getAttribute('popover')).toBe('manual');
  });
});

describe('snackbar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    snackbarContainer.replaceChildren();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('adds a snackbar with the message to the container', () => {
    snackbar('success', 'Saved');

    expect(items()).toHaveLength(1);
    expect(messageOf(items()[0])).toBe('Saved');
  });

  it.each([
    ['success', 'snackbar--success', 'snackbar--error'],
    ['error', 'snackbar--error', 'snackbar--success'],
  ] as const)(
    'uses only the %s modifier class for type %s',
    (type, expectedClass, otherClass) => {
      snackbar(type, 'Message');

      const [item] = items() as [HTMLElement];

      expect(item.classList.contains(expectedClass)).toBe(true);
      expect(item.classList.contains(otherClass)).toBe(false);
    },
  );

  it('renders the message as plain text, not as HTML', () => {
    snackbar('error', '<b>bold</b>');

    const [item] = items() as [HTMLElement];

    expect(messageOf(item)).toBe('<b>bold</b>');
    expect(item.querySelector('b')).toBeNull();
  });

  it('renders a close button that does not submit forms', () => {
    snackbar('success', 'Saved');

    const button = closeButtonOf(items()[0]);

    expect(button.textContent).toBe('X');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('stacks several snackbars in the order they were shown', () => {
    snackbar('success', 'first');
    snackbar('error', 'second');

    expect(items().map((item) => messageOf(item))).toEqual(['first', 'second']);
  });

  it('removes the snackbar when its close button is clicked', () => {
    snackbar('success', 'Saved');

    closeButtonOf(items()[0]).click();

    expect(items()).toHaveLength(0);
  });

  it('removes only the snackbar whose close button was clicked', () => {
    snackbar('success', 'first');
    snackbar('error', 'second');

    closeButtonOf(items()[0]).click();

    expect(items().map((item) => messageOf(item))).toEqual(['second']);
  });

  it('removes the snackbar automatically after 5 seconds', () => {
    snackbar('success', 'Saved');

    vi.advanceTimersByTime(AUTO_CLOSE_MS - 1);
    expect(items()).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(items()).toHaveLength(0);
  });

  it('times each snackbar from the moment it was shown', () => {
    snackbar('success', 'first');
    vi.advanceTimersByTime(3000);
    snackbar('error', 'second');

    vi.advanceTimersByTime(2000);
    expect(items().map((item) => messageOf(item))).toEqual(['second']);

    vi.advanceTimersByTime(3000);
    expect(items()).toHaveLength(0);
  });

  it('does not fail when the timer fires after a manual close', () => {
    snackbar('success', 'Saved');
    closeButtonOf(items()[0]).click();

    expect(() => vi.advanceTimersByTime(AUTO_CLOSE_MS)).not.toThrow();
    expect(items()).toHaveLength(0);
  });
});
