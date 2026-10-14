import { describe, it, expect } from 'vitest';
import { feedbackCountPlaceholder, fillFeedbackCount } from './feedback-count';

const buildContainer = () => {
  const container = document.createElement('div');
  container.append(
    feedbackCountPlaceholder('rating'),
    feedbackCountPlaceholder('likes'),
  );
  return container;
};

const ratingOf = (container: HTMLElement) =>
  container.querySelector('.feedback-count--rating') as HTMLElement;

const likesOf = (container: HTMLElement) =>
  container.querySelector('.feedback-count--likes') as HTMLElement;

describe('feedbackCountPlaceholder', () => {
  it('renders a loading rating item', () => {
    const item = feedbackCountPlaceholder('rating');

    expect(item.tagName).toBe('SPAN');
    expect([...item.classList]).toEqual([
      'feedback-count',
      'feedback-count--loading',
      'feedback-count--rating',
    ]);
  });

  it('renders a loading likes item', () => {
    const item = feedbackCountPlaceholder('likes');

    expect(item.tagName).toBe('SPAN');
    expect([...item.classList]).toEqual([
      'feedback-count',
      'feedback-count--loading',
      'feedback-count--likes',
    ]);
  });

  it.each(['rating', 'likes'] as const)(
    'contains one empty placeholder box for %s',
    (type) => {
      const item = feedbackCountPlaceholder(type);

      expect(item.children).toHaveLength(1);
      expect(item.firstElementChild?.tagName).toBe('DIV');
      expect(item.textContent).toBe('');
    },
  );

  it('creates a new element on every call', () => {
    expect(feedbackCountPlaceholder('rating')).not.toBe(
      feedbackCountPlaceholder('rating'),
    );
  });
});

describe('fillFeedbackCount', () => {
  describe('rating', () => {
    it.each([
      [4.5, '4.5'],
      [3.8, '3.8'],
      [0, '0'],
    ])('shows %s as "%s"', (rating, expected) => {
      const container = buildContainer();

      fillFeedbackCount(container, { rating, likes: 0 });

      expect(ratingOf(container).textContent).toBe(expected);
    });
  });

  describe('likes', () => {
    it.each([
      [1000, '1.0K'],
      [1500, '1.5K'],
      [1999, '1.9K'],
      [12_345, '12.3K'],
      [100_000, '100.0K'],
    ])('shows %i likes as "%s"', (likes, expected) => {
      const container = buildContainer();

      fillFeedbackCount(container, { rating: 4, likes });

      expect(likesOf(container).textContent).toBe(expected);
    });

    it('truncates instead of rounding up', () => {
      const container = buildContainer();

      fillFeedbackCount(container, { rating: 4, likes: 1999 });

      expect(likesOf(container).textContent).not.toBe('2.0K');
    });
  });

  describe('leaving the loading state', () => {
    it('removes the loading modifier from both items', () => {
      const container = buildContainer();

      fillFeedbackCount(container, { rating: 4.5, likes: 1500 });

      expect(
        ratingOf(container).classList.contains('feedback-count--loading'),
      ).toBe(false);
      expect(
        likesOf(container).classList.contains('feedback-count--loading'),
      ).toBe(false);
    });

    it('keeps the base classes', () => {
      const container = buildContainer();

      fillFeedbackCount(container, { rating: 4.5, likes: 1500 });

      expect([...ratingOf(container).classList]).toEqual([
        'feedback-count',
        'feedback-count--rating',
      ]);
      expect([...likesOf(container).classList]).toEqual([
        'feedback-count',
        'feedback-count--likes',
      ]);
    });

    it('replaces the placeholder box with the text', () => {
      const container = buildContainer();

      fillFeedbackCount(container, { rating: 4.5, likes: 1500 });

      expect(ratingOf(container).children).toHaveLength(0);
      expect(likesOf(container).children).toHaveLength(0);
    });
  });

  describe('filling again', () => {
    it('updates the shown values', () => {
      const container = buildContainer();
      fillFeedbackCount(container, { rating: 4.5, likes: 1500 });

      fillFeedbackCount(container, { rating: 3.8, likes: 12_345 });

      expect(ratingOf(container).textContent).toBe('3.8');
      expect(likesOf(container).textContent).toBe('12.3K');
    });
  });

  describe('partial containers', () => {
    it('fills the rating when there is no likes item', () => {
      const container = document.createElement('div');
      container.append(feedbackCountPlaceholder('rating'));

      expect(() =>
        fillFeedbackCount(container, { rating: 4.5, likes: 1500 }),
      ).not.toThrow();
      expect(ratingOf(container).textContent).toBe('4.5');
    });

    it('fills the likes when there is no rating item', () => {
      const container = document.createElement('div');
      container.append(feedbackCountPlaceholder('likes'));

      expect(() =>
        fillFeedbackCount(container, { rating: 4.5, likes: 1500 }),
      ).not.toThrow();
      expect(likesOf(container).textContent).toBe('1.5K');
    });

    it('does nothing to an empty container', () => {
      const container = document.createElement('div');

      expect(() =>
        fillFeedbackCount(container, { rating: 4.5, likes: 1500 }),
      ).not.toThrow();
      expect(container.children).toHaveLength(0);
    });

    it('leaves other content in the container alone', () => {
      const container = buildContainer();
      const other = document.createElement('span');
      other.className = 'other feedback-count--loading';
      other.textContent = 'untouched';
      container.append(other);

      fillFeedbackCount(container, { rating: 4.5, likes: 1500 });

      expect(other.textContent).toBe('untouched');
      expect(other.classList.contains('feedback-count--loading')).toBe(true);
    });
  });
});
