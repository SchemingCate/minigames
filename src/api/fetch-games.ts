import type {
  LibraryParameters,
  GameListResponse,
} from '../helpers/interfaces';

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

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/games?featured=${isFeatured}&page=${pageParameter}&limit=${limitParameter}&category=${categoryParameter}&sort=${sortParameter}`,
  );
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  return (await response.json()) as GameListResponse;
};
