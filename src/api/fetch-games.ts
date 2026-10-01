import type {
  LibraryParameters,
  GameListResponse,
} from '../helpers/interfaces';
import { networkError, serverError } from './errors';

export const fetchGames = async ({
  featured,
  page,
  limit,
  category,
  sort,
}: LibraryParameters): Promise<GameListResponse> => {
  const isFeatured = featured ?? false;
  const pageParameter = page ?? 1;
  const limitParameter = limit ?? 10;
  const categoryParameter = category ?? 'all';
  const sortParameter = sort ?? 'rating-desc';

  let response: Response;
  try {
    response = await fetch(
      `${import.meta.env.VITE_API_URL}/games?featured=${isFeatured}&page=${pageParameter}&limit=${limitParameter}&category=${categoryParameter}&sort=${sortParameter}`,
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
