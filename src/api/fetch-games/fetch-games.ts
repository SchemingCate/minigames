import type { GameListResponse } from '../../helpers/interfaces';
import { networkError, serverError } from '../errors';
import { parameters } from './fetch-games-parameters';

export const fetchGames = async (): Promise<GameListResponse> => {
  const p = parameters;

  let response: Response;
  try {
    response = await fetch(
      `${import.meta.env.VITE_API_URL}/games?featured=${p.featured}&page=${p.page}&limit=${p.limit}&category=${p.category}&sort=${p.sort}`,
    );
  } catch {
    throw new networkError();
  }
  if (!response.ok) {
    throw new serverError(response.status);
  }

  try {
    return (await response.json()) as GameListResponse;
  } catch {
    throw new serverError(response.status, 'Invalid data');
  }
};
