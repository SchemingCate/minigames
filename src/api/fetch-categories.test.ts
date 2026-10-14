import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { networkError, serverError } from './errors';
import { fetchCategories } from './fetch-categories';

const API = 'https://api.test';

const fetchMock = vi.fn();

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

describe('fetchCategories', () => {
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
    it('requests the categories endpoint once', async () => {
      fetchMock.mockResolvedValue(okResponse({}));

      await fetchCategories();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(`${API}/categories`);
    });

    it('takes the base URL from the environment', async () => {
      vi.stubEnv('VITE_API_URL', 'https://other.example');
      fetchMock.mockResolvedValue(okResponse({}));

      await fetchCategories();

      expect(fetchMock).toHaveBeenCalledWith(
        'https://other.example/categories',
      );
    });

    it('asks the server again on every call instead of caching', async () => {
      fetchMock.mockResolvedValue(okResponse({}));

      await fetchCategories();
      await fetchCategories();

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('on success', () => {
    it('returns the parsed response body', async () => {
      const body = {
        data: [
          { id: 1, name: 'puzzle' },
          { id: 2, name: 'arcade' },
        ],
      };
      fetchMock.mockResolvedValue(okResponse(body));

      await expect(fetchCategories()).resolves.toEqual(body);
    });
  });

  describe('when the network fails', () => {
    it('throws a networkError with the default message', async () => {
      fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

      const error = await failureOf(fetchCategories());

      expect(error).toBeInstanceOf(networkError);
      expect((error as networkError).message).toBe(
        'Network error - check your internet connection',
      );
    });

    it('does not turn a network failure into a server error', async () => {
      fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

      expect(await failureOf(fetchCategories())).not.toBeInstanceOf(
        serverError,
      );
    });
  });

  describe('when the server answers with an error status', () => {
    it.each([400, 404, 429, 500, 503])(
      'throws a serverError for %i',
      async (status) => {
        const response = failedResponse(status);
        fetchMock.mockResolvedValue(response);

        const error = await failureOf(fetchCategories());

        expect(error).toBeInstanceOf(serverError);
        expect((error as serverError).errorNumber).toBe(status);
        expect((error as serverError).message).toBe(`Server error ${status}`);
      },
    );

    it('does not try to read the body of a failed response', async () => {
      const response = failedResponse(500);
      fetchMock.mockResolvedValue(response);

      await failureOf(fetchCategories());

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

      const error = await failureOf(fetchCategories());

      expect(error).toBeInstanceOf(serverError);
      expect((error as serverError).message).toBe('Invalid data');
      expect((error as serverError).errorNumber).toBe(200);
    });
  });
});
