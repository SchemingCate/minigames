import { describe, it, expect, beforeEach, vi } from 'vitest';
import type {
  GameDetailsResponse,
  GameParameters,
} from '../../../helpers/interfaces';

const mocks = vi.hoisted(() => ({
  fetchGameDetails:
    vi.fn<(parameters: GameParameters) => Promise<GameDetailsResponse>>(),
  getImageUrl: vi.fn<(path: string) => string>(),
  feedbackCountPlaceholder: vi.fn<(kind: string) => HTMLElement>(),
  fillFeedbackCount: vi.fn<(container: HTMLElement, counts: unknown) => void>(),
  recordsTablePlaceholder: vi.fn<() => HTMLElement>(),
  fillRecordsTable: vi.fn<(records: unknown) => void>(),
  errorBanner: vi.fn<(error: unknown, retry: () => void) => HTMLElement>(),
}));

vi.mock('../../../api/fetch-game-details', () => ({
  fetchGameDetails: mocks.fetchGameDetails,
}));
vi.mock('../../../helpers/get-image-url', () => ({
  getImageUrl: mocks.getImageUrl,
}));
vi.mock('../feedback-count/feedback-count', () => ({
  feedbackCountPlaceholder: mocks.feedbackCountPlaceholder,
  fillFeedbackCount: mocks.fillFeedbackCount,
}));
vi.mock('../records-table/records-table', () => ({
  recordsTablePlaceholder: mocks.recordsTablePlaceholder,
  fillRecordsTable: mocks.fillRecordsTable,
}));
vi.mock('../error-banner/error-banner', () => ({
  errorBanner: mocks.errorBanner,
}));

const IMAGE_PATH = '/assets/images/games/tetris.png';

const details = () =>
  ({
    data: {
      heroImage: IMAGE_PATH,
      name: 'Tetris',
      fullDescription: 'Stack the falling blocks.',
      likesCount: 120,
      rating: 4.5,
      specs: {
        genre: 'Puzzle',
        players: '1',
        duration: '10 min',
        price: 'Free',
      },
      topRecords: [{ player: 'Ann', score: 100 }],
    },
  }) as unknown as GameDetailsResponse;

const element = (tag: string, id: string) => {
  const created = document.createElement(tag);
  created.id = id;
  return created;
};

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

// the module keeps its elements at module level, so every test gets a fresh copy
const load = async () => {
  const loaded = await import('./game-modal');
  const dialog = loaded.gameModal() as HTMLDialogElement;
  // jsdom does not reliably implement dialog.close()
  const close = vi.fn();
  dialog.close = close;
  return { ...loaded, dialog, close };
};

const part = (dialog: HTMLElement, selector: string) =>
  dialog.querySelector(selector) as HTMLElement;

const specValue = (dialog: HTMLElement, name: string) =>
  part(dialog, `[data-valuekey="${name}"]`).textContent;

const didSendCommand = (
  dialog: HTMLElement,
  command: string,
  source: unknown,
) =>
  dialog.dispatchEvent(
    Object.assign(new Event('command'), { command, source }),
  );

const opener = (game?: string) => {
  const button = document.createElement('button');
  if (game !== undefined) button.dataset.game = game;
  return button;
};

describe('gameModal', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
    mocks.getImageUrl.mockImplementation((path) => `/img${path}`);
    mocks.feedbackCountPlaceholder.mockImplementation((kind) =>
      element('span', `placeholder-${kind}`),
    );
    mocks.recordsTablePlaceholder.mockImplementation(() =>
      element('table', 'records-placeholder'),
    );
    mocks.errorBanner.mockImplementation(() => element('div', 'error-banner'));
    mocks.fetchGameDetails.mockResolvedValue(details());
  });

  describe('structure', () => {
    it('renders the game dialog in its loading state', async () => {
      const { dialog } = await load();

      expect(dialog.tagName).toBe('DIALOG');
      expect(dialog.id).toBe('gameModal');
      expect(dialog.classList.contains('game-modal')).toBe(true);
      expect(dialog.classList.contains('game-modal--loading')).toBe(true);
      expect(dialog.hasAttribute('open')).toBe(false);
    });

    it('holds the close button, the hero and the main content, in that order', async () => {
      const { dialog } = await load();
      const content = part(dialog, '.game-modal_content');

      expect([...content.children].map((child) => child.className)).toEqual([
        'game-modal_content_button',
        'game-modal_content_hero',
        'game-modal_content_main',
      ]);
    });

    it('lays out header, description, specs, actions and records in the main content', async () => {
      const { dialog } = await load();
      const main = part(dialog, '.game-modal_content_main');

      expect([...main.children].map((child) => child.className)).toEqual([
        'game-modal_content_main_header',
        'game-modal_content_main_description',
        'game-modal_content_main_specs',
        'game-modal_content_main_action',
        'game-modal_content_main_records',
      ]);
    });

    it('has a close button that targets this dialog', async () => {
      const { dialog } = await load();
      const closeButton = part(dialog, '.game-modal_content_button');

      expect(closeButton.getAttribute('command')).toBe('close');
      expect(closeButton.getAttribute('commandfor')).toBe(dialog.id);
      expect(closeButton.getAttribute('aria-label')).toBe('close modal');
    });

    it('starts with an image that has no source yet', async () => {
      const { dialog } = await load();
      const image = part(dialog, '.game-modal_content_hero img');

      expect(image).toBeInstanceOf(HTMLImageElement);
      expect(image.hasAttribute('src')).toBe(false);
    });

    it('shows a rating and a likes placeholder next to the title', async () => {
      const { dialog } = await load();
      const feedback = part(dialog, '.game-modal_content_main_header_feedback');

      expect(
        mocks.feedbackCountPlaceholder.mock.calls.map(([kind]) => kind),
      ).toEqual(['rating', 'likes']);
      expect([...feedback.children].map((child) => child.id)).toEqual([
        'placeholder-rating',
        'placeholder-likes',
      ]);
      expect(
        part(dialog, 'h2.game-modal_content_main_header_title').textContent,
      ).toBe('');
    });

    it('lists the four specs with empty values', async () => {
      const { dialog } = await load();
      const names = [...dialog.querySelectorAll('dt')].map(
        (name) => name.textContent,
      );
      const values = [...dialog.querySelectorAll('dd')].map(
        (value) => value.textContent,
      );

      expect(names).toEqual(['Genre', 'Players', 'Duration', 'Price']);
      expect(values).toEqual(['', '', '', '']);
    });

    it('offers play and favorite actions', async () => {
      const { dialog } = await load();
      const buttons = [
        ...part(dialog, '.game-modal_content_main_action').querySelectorAll(
          'button',
        ),
      ];

      expect(buttons.map((button) => button.textContent)).toEqual([
        'Play now',
        'Add to favorites',
      ]);
    });

    it('ends with the records heading and the records placeholder', async () => {
      const { dialog } = await load();
      const records = part(dialog, '.game-modal_content_main_records');

      expect(records.firstElementChild?.textContent).toBe('🏆 Top Records');
      expect(records.lastElementChild?.id).toBe('records-placeholder');
    });
  });

  describe('closing by clicking the backdrop', () => {
    it('closes the dialog and goes back to the loading state', async () => {
      const { dialog, close, updateGameModal } = await load();
      await updateGameModal({ gameSlug: 'tetris' });
      expect(dialog.classList.contains('game-modal--loading')).toBe(false);

      dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(close).toHaveBeenCalledTimes(1);
      expect(dialog.classList.contains('game-modal--loading')).toBe(true);
    });

    it('stays open when the click happens inside the content', async () => {
      const { dialog, close, updateGameModal } = await load();
      await updateGameModal({ gameSlug: 'tetris' });

      part(dialog, '.game-modal_content').dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      );

      expect(close).not.toHaveBeenCalled();
      expect(dialog.classList.contains('game-modal--loading')).toBe(false);
    });
  });

  describe('opening through the command event', () => {
    it('loads the game named by the opener', async () => {
      const { dialog } = await load();

      didSendCommand(dialog, 'show-modal', opener('tetris'));
      await flush();

      expect(mocks.fetchGameDetails).toHaveBeenCalledTimes(1);
      expect(mocks.fetchGameDetails).toHaveBeenCalledWith({
        gameSlug: 'tetris',
      });
      expect(part(dialog, 'h2').textContent).toBe('Tetris');
    });

    it('ignores other commands', async () => {
      const { dialog } = await load();

      didSendCommand(dialog, 'close', opener('tetris'));
      await flush();

      expect(mocks.fetchGameDetails).not.toHaveBeenCalled();
    });

    it('ignores a command that has no source', async () => {
      const { dialog } = await load();

      didSendCommand(dialog, 'show-modal', undefined);
      await flush();

      expect(mocks.fetchGameDetails).not.toHaveBeenCalled();
    });

    it('ignores a source that is not an HTML element', async () => {
      const { dialog } = await load();
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      didSendCommand(dialog, 'show-modal', svg);
      await flush();

      expect(mocks.fetchGameDetails).not.toHaveBeenCalled();
    });

    it.each([
      ['has no data-game attribute', undefined],
      ['has an empty data-game attribute', ''],
    ])('ignores an opener that %s', async (_label, game) => {
      const { dialog } = await load();

      didSendCommand(dialog, 'show-modal', opener(game));
      await flush();

      expect(mocks.fetchGameDetails).not.toHaveBeenCalled();
    });
  });

  describe('updateGameModal', () => {
    describe('on success', () => {
      it('requests the details with the given parameters', async () => {
        const { updateGameModal } = await load();

        await updateGameModal({ gameSlug: 'tetris' });

        expect(mocks.fetchGameDetails).toHaveBeenCalledWith({
          gameSlug: 'tetris',
        });
      });

      it('leaves the loading state', async () => {
        const { dialog, updateGameModal } = await load();

        await updateGameModal({ gameSlug: 'tetris' });

        expect(dialog.classList.contains('game-modal--loading')).toBe(false);
      });

      it('shows the hero image with the game name as alt text', async () => {
        const { dialog, updateGameModal } = await load();

        await updateGameModal({ gameSlug: 'tetris' });
        const image = part(dialog, '.game-modal_content_hero img');

        expect(mocks.getImageUrl).toHaveBeenCalledWith(IMAGE_PATH);
        expect(image.getAttribute('src')).toBe(`/img${IMAGE_PATH}`);
        expect(image.getAttribute('alt')).toBe('Tetris');
      });

      it('shows the title and the full description', async () => {
        const { dialog, updateGameModal } = await load();

        await updateGameModal({ gameSlug: 'tetris' });

        expect(
          part(dialog, '.game-modal_content_main_header_title').textContent,
        ).toBe('Tetris');
        expect(
          part(dialog, '.game-modal_content_main_description').textContent,
        ).toBe('Stack the falling blocks.');
      });

      it('fills the feedback counts in the feedback container', async () => {
        const { dialog, updateGameModal } = await load();

        await updateGameModal({ gameSlug: 'tetris' });

        expect(mocks.fillFeedbackCount).toHaveBeenCalledWith(
          part(dialog, '.game-modal_content_main_header_feedback'),
          { likes: 120, rating: 4.5 },
        );
      });

      it.each([
        ['Genre', 'Puzzle'],
        ['Players', '1'],
        ['Duration', '10 min'],
        ['Price', 'Free'],
      ])('shows the %s spec', async (name, expected) => {
        const { dialog, updateGameModal } = await load();

        await updateGameModal({ gameSlug: 'tetris' });

        expect(specValue(dialog, name)).toBe(expected);
      });

      it('fills the records table with the top records', async () => {
        const { updateGameModal } = await load();

        await updateGameModal({ gameSlug: 'tetris' });

        expect(mocks.fillRecordsTable).toHaveBeenCalledWith([
          { player: 'Ann', score: 100 },
        ]);
      });

      it('does not show an error banner', async () => {
        const { updateGameModal } = await load();

        await updateGameModal({ gameSlug: 'tetris' });

        expect(mocks.errorBanner).not.toHaveBeenCalled();
      });

      it('replaces the previous game when another one is loaded', async () => {
        const { dialog, updateGameModal } = await load();
        await updateGameModal({ gameSlug: 'tetris' });
        const next = details();
        next.data.name = 'Snake';
        next.data.specs.genre = 'Arcade';
        mocks.fetchGameDetails.mockResolvedValue(next);

        await updateGameModal({ gameSlug: 'snake' });

        expect(part(dialog, 'h2').textContent).toBe('Snake');
        expect(specValue(dialog, 'Genre')).toBe('Arcade');
      });
    });

    describe('when loading fails', () => {
      it('leaves the loading state and shows the error banner in the dialog', async () => {
        const { dialog, updateGameModal } = await load();
        const failure = new Error('network down');
        mocks.fetchGameDetails.mockRejectedValueOnce(failure);

        await updateGameModal({ gameSlug: 'tetris' });

        expect(dialog.classList.contains('game-modal--loading')).toBe(false);
        expect(mocks.errorBanner).toHaveBeenCalledWith(
          failure,
          expect.any(Function),
        );
        expect(dialog.querySelector('#error-banner')).not.toBeNull();
      });

      it('leaves the content empty', async () => {
        const { dialog, updateGameModal } = await load();
        mocks.fetchGameDetails.mockRejectedValueOnce(new Error('network down'));

        await updateGameModal({ gameSlug: 'tetris' });

        expect(part(dialog, 'h2').textContent).toBe('');
        expect(mocks.fillFeedbackCount).not.toHaveBeenCalled();
        expect(mocks.fillRecordsTable).not.toHaveBeenCalled();
      });

      it('retries with the same parameters when retry is clicked', async () => {
        const { updateGameModal } = await load();
        mocks.fetchGameDetails.mockRejectedValueOnce(new Error('network down'));
        await updateGameModal({ gameSlug: 'tetris' });
        const [, retry] = mocks.errorBanner.mock.calls[0];

        retry();
        await flush();

        expect(mocks.fetchGameDetails).toHaveBeenCalledTimes(2);
        expect(mocks.fetchGameDetails).toHaveBeenLastCalledWith({
          gameSlug: 'tetris',
        });
      });

      it('shows the game after a successful retry', async () => {
        const { dialog, updateGameModal } = await load();
        mocks.fetchGameDetails.mockRejectedValueOnce(new Error('network down'));
        await updateGameModal({ gameSlug: 'tetris' });
        const [, retry] = mocks.errorBanner.mock.calls[0];

        retry();
        await flush();

        expect(part(dialog, 'h2').textContent).toBe('Tetris');
      });

      it('shows the error banner when the image path is unknown', async () => {
        const { updateGameModal } = await load();
        const failure = new Error(`Image not found: ${IMAGE_PATH}`);
        mocks.getImageUrl.mockImplementation(() => {
          throw failure;
        });

        await updateGameModal({ gameSlug: 'tetris' });

        expect(mocks.errorBanner).toHaveBeenCalledWith(
          failure,
          expect.any(Function),
        );
        expect(mocks.fillRecordsTable).not.toHaveBeenCalled();
      });
    });
  });
});
