import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { GameParameters } from '../helpers/interfaces';
import { networkError, serverError } from './errors';
import { fetchGameDetails } from './fetch-game-details';

const API = 'https://api.test';

const fetchMock = vi.fn<(url: string) => Promise<unknown>>();

const parametersFor = (gameSlug: string) => ({ gameSlug }) as GameParameters;

const okResponse = (body: unknown) => ({
  ok: true,
  status: 200,
  json: vi.fn().mockResolvedValue(body),
});

const failedResponse = (status: number) => ({
  ok: false,
  status,
  json: vi.fn(),
});

const failureOf = async (promise: Promise<unknown>): Promise<unknown> => {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('Expected the promise to reject');
};

describe('fetchGameDetails', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', API);
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe('building the request', () => {
    it('requests the game by its slug', async () => {
      fetchMock.mockResolvedValue(okResponse({}));

      await fetchGameDetails(parametersFor('tetris'));

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(`${API}/games/tetris`);
    });

    it.each(['snake', '2048', 'memory-match', 'tic-tac-toe'])(
      'builds the URL for the slug "%s"',
      async (slug) => {
        fetchMock.mockResolvedValue(okResponse({}));

        await fetchGameDetails(parametersFor(slug));

        expect(fetchMock).toHaveBeenCalledWith(`${API}/games/${slug}`);
      },
    );

    it('uses the slug of each call, not the previous one', async () => {
      fetchMock.mockResolvedValue(okResponse({}));

      await fetchGameDetails(parametersFor('tetris'));
      await fetchGameDetails(parametersFor('snake'));

      expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
        `${API}/games/tetris`,
        `${API}/games/snake`,
      ]);
    });

    it('takes the base URL from the environment', async () => {
      vi.stubEnv('VITE_API_URL', 'https://other.example');
      fetchMock.mockResolvedValue(okResponse({}));

      await fetchGameDetails(parametersFor('tetris'));

      expect(fetchMock).toHaveBeenCalledWith(
        'https://other.example/games/tetris',
      );
    });
  });

  describe('on success', () => {
    it('returns the parsed response body', async () => {
      const body = { data: { id: 7, slug: 'tetris', title: 'Tetris' } };
      fetchMock.mockResolvedValue(okResponse(body));

      await expect(fetchGameDetails(parametersFor('tetris'))).resolves.toEqual(
        body,
      );
    });
  });

  describe('when the network fails', () => {
    it('throws a networkError with the default message', async () => {
      fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

      const error = await failureOf(fetchGameDetails(parametersFor('tetris')));

      expect(error).toBeInstanceOf(networkError);
      expect((error as networkError).message).toBe(
        'Network error - check your internet connection',
      );
    });

    it('does not turn a network failure into a server error', async () => {
      fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

      const error = await failureOf(fetchGameDetails(parametersFor('tetris')));

      expect(error).not.toBeInstanceOf(serverError);
    });
  });

  describe('when the server answers with an error status', () => {
    it.each([400, 404, 429, 500, 503])(
      'throws a serverError for %i',
      async (status) => {
        fetchMock.mockResolvedValue(failedResponse(status));

        const error = await failureOf(
          fetchGameDetails(parametersFor('tetris')),
        );

        expect(error).toBeInstanceOf(serverError);
        expect((error as serverError).errorNumber).toBe(status);
        expect((error as serverError).message).toBe(`Server error ${status}`);
      },
    );

    it('does not try to read the body of a failed response', async () => {
      const response = failedResponse(404);
      fetchMock.mockResolvedValue(response);

      await failureOf(fetchGameDetails(parametersFor('missing-game')));

      expect(response.json).not.toHaveBeenCalled();
    });
  });

  describe('when the body is not valid JSON', () => {
    it('throws a serverError marked as invalid data', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
      });

      const error = await failureOf(fetchGameDetails(parametersFor('tetris')));

      expect(error).toBeInstanceOf(serverError);
      expect((error as serverError).message).toBe('Invalid data');
      expect((error as serverError).errorNumber).toBe(200);
    });
  });
});
