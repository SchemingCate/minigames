import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { GameInfo } from '../../../helpers/interfaces';

const mocks = vi.hoisted(() => ({
  getImageUrl: vi.fn<(path: string) => string>(),
}));

vi.mock('../../../helpers/get-image-url', () => ({
  getImageUrl: mocks.getImageUrl,
}));

import { createGameCard } from './game-card';

const IMAGE_PATH = '/assets/images/games/tetris-card.png';

const gameInfo = (overrides: Partial<GameInfo> = {}): GameInfo =>
  ({
    name: 'Tetris',
    category: 'Puzzle',
    price: 'Free',
    shortDescription: 'Stack the falling blocks.',
    slug: 'tetris',
    likesCount: 1500,
    rating: 4.5,
    cardImage: IMAGE_PATH,
    ...overrides,
  }) as GameInfo;

const part = (card: HTMLElement, selector: string) =>
  card.querySelector(selector) as HTMLElement;

describe('createGameCard', () => {
  beforeEach(() => {
    mocks.getImageUrl.mockReset();
    mocks.getImageUrl.mockImplementation((path) => `/img${path}`);
  });

  describe('structure', () => {
    it('returns the card and a function to fill it', () => {
      const result = createGameCard();

      expect(result.card).toBeInstanceOf(HTMLElement);
      expect(typeof result.fillGameCard).toBe('function');
      expect(Object.keys(result)).toEqual(['card', 'fillGameCard']);
    });

    it('renders an article in the loading state', () => {
      const { card } = createGameCard();

      expect(card.tagName).toBe('ARTICLE');
      expect(card.classList.contains('card')).toBe(true);
      expect(card.classList.contains('card--loading')).toBe(true);
    });

    it('puts the image area before the content', () => {
      const { card } = createGameCard();

      expect([...card.children].map((child) => child.className)).toEqual([
        'card_image card_image--loading',
        'card_content',
      ]);
    });

    it('starts with an image that has no source yet', () => {
      const { card } = createGameCard();
      const image = part(card, '.card_image img');

      expect(image).toBeInstanceOf(HTMLImageElement);
      expect(image.hasAttribute('src')).toBe(false);
    });

    it('lays out title, description and footer in the content', () => {
      const { card } = createGameCard();
      const content = part(card, '.card_content');

      expect([...content.children].map((child) => child.className)).toEqual([
        'card_content_title',
        'card_content_description',
        'card_content_footer',
      ]);
    });

    it('puts the heading before the category in the title', () => {
      const { card } = createGameCard();
      const title = part(card, '.card_content_title');

      expect(title.firstElementChild?.tagName).toBe('H2');
      expect(title.firstElementChild?.className).toBe(
        'card_content_title_heading',
      );
      expect(title.lastElementChild?.className).toBe(
        'card_content_title_category',
      );
    });

    it('lays out feedback, price and the details button in the footer', () => {
      const { card } = createGameCard();
      const footer = part(card, '.card_content_footer');

      expect([...footer.children].map((child) => child.className)).toEqual([
        'card_content_footer_feedback',
        'card_content_footer_price',
        'card_content_footer_button',
      ]);
    });

    it('shows loading placeholders for the rating and the likes', () => {
      const { card } = createGameCard();
      const feedback = part(card, '.card_content_footer_feedback');

      expect(
        feedback.querySelectorAll('.feedback-count--loading'),
      ).toHaveLength(2);
      expect(feedback.querySelectorAll('.feedback-count--rating')).toHaveLength(
        1,
      );
      expect(feedback.querySelectorAll('.feedback-count--likes')).toHaveLength(
        1,
      );
    });

    it('has empty text fields until it is filled', () => {
      const { card } = createGameCard();

      expect(part(card, '.card_content_title_heading').textContent).toBe('');
      expect(part(card, '.card_content_title_category').textContent).toBe('');
      expect(part(card, '.card_content_footer_price').textContent).toBe('');
      expect(part(card, '.card_content_description').textContent).toBe('');
    });
  });

  describe('details button', () => {
    it('opens the game modal', () => {
      const { card } = createGameCard();
      const button = part(card, '.card_content_footer_button');

      expect(button.textContent).toBe('Details');
      expect(button.getAttribute('type')).toBe('button');
      expect(button.getAttribute('command')).toBe('show-modal');
      expect(button.getAttribute('commandfor')).toBe('gameModal');
    });

    it('does not name a game before the card is filled', () => {
      const { card } = createGameCard();

      expect(
        Object.hasOwn(
          part(card, '.card_content_footer_button').dataset,
          'game',
        ),
      ).toBe(false);
    });
  });

  describe('fillGameCard', () => {
    it('shows the name, category, price and description', () => {
      const { card, fillGameCard } = createGameCard();

      fillGameCard(gameInfo());

      expect(part(card, '.card_content_title_heading').textContent).toBe(
        'Tetris',
      );
      expect(part(card, '.card_content_title_category').textContent).toBe(
        'Puzzle',
      );
      expect(part(card, '.card_content_footer_price').textContent).toBe('Free');
      expect(part(card, '.card_content_description').textContent).toBe(
        'Stack the falling blocks.',
      );
    });

    it('leaves the loading state', () => {
      const { card, fillGameCard } = createGameCard();

      fillGameCard(gameInfo());

      expect(card.classList.contains('card--loading')).toBe(false);
      expect(card.classList.contains('card')).toBe(true);
    });

    it('tells the details button which game to open', () => {
      const { card, fillGameCard } = createGameCard();

      fillGameCard(gameInfo({ slug: 'snake' }));

      expect(part(card, '.card_content_footer_button').dataset.game).toBe(
        'snake',
      );
    });

    it('shows the card image with the game name as alt text', () => {
      const { card, fillGameCard } = createGameCard();

      fillGameCard(gameInfo());
      const image = part(card, '.card_image img');

      expect(mocks.getImageUrl).toHaveBeenCalledWith(IMAGE_PATH);
      expect(image.getAttribute('src')).toBe(`/img${IMAGE_PATH}`);
      expect(image.getAttribute('alt')).toBe('Tetris');
    });

    it('shows the rating and the abbreviated likes', () => {
      const { card, fillGameCard } = createGameCard();

      fillGameCard(gameInfo({ rating: 4.5, likesCount: 1500 }));
      const feedback = part(card, '.card_content_footer_feedback');

      expect(part(feedback, '.feedback-count--rating').textContent).toBe('4.5');
      expect(part(feedback, '.feedback-count--likes').textContent).toBe('1.5K');
      expect(
        feedback.querySelectorAll('.feedback-count--loading'),
      ).toHaveLength(0);
    });

    it('can be filled again with another game', () => {
      const { card, fillGameCard } = createGameCard();
      fillGameCard(gameInfo());

      fillGameCard(
        gameInfo({
          name: 'Snake',
          slug: 'snake',
          category: 'Arcade',
          rating: 3.8,
          likesCount: 12_345,
        }),
      );

      expect(part(card, '.card_content_title_heading').textContent).toBe(
        'Snake',
      );
      expect(part(card, '.card_content_title_category').textContent).toBe(
        'Arcade',
      );
      expect(part(card, '.card_content_footer_button').dataset.game).toBe(
        'snake',
      );
      expect(part(card, '.card_image img').getAttribute('alt')).toBe('Snake');
      expect(part(card, '.feedback-count--rating').textContent).toBe('3.8');
      expect(part(card, '.feedback-count--likes').textContent).toBe('12.3K');
    });

    describe('when the image is unknown', () => {
      it('passes the error on to the caller', () => {
        const { fillGameCard } = createGameCard();
        mocks.getImageUrl.mockImplementation((path) => {
          throw new Error(`Image not found: ${path}`);
        });

        expect(() => fillGameCard(gameInfo())).toThrow(
          `Image not found: ${IMAGE_PATH}`,
        );
      });
    });
  });

  describe('several cards', () => {
    it('creates independent cards', () => {
      const first = createGameCard();
      const second = createGameCard();

      first.fillGameCard(gameInfo());

      expect(first.card.classList.contains('card--loading')).toBe(false);
      expect(second.card.classList.contains('card--loading')).toBe(true);
      expect(part(second.card, '.card_content_title_heading').textContent).toBe(
        '',
      );
    });
  });
});
