import type {
  GameDetailsResponse,
  GameParameters,
} from '../helpers/interfaces';
import { networkError, serverError } from './errors';

export const fetchGameDetails = async (
  parameters: GameParameters,
): Promise<GameDetailsResponse> => {
  let response: Response;
  try {
    response = await fetch(
      `${import.meta.env.VITE_API_URL}/games/${parameters.gameSlug}`,
    );
  } catch {
    throw new networkError();
  }
  if (!response.ok) throw new serverError(response.status);

  try {
    return (await response.json()) as GameDetailsResponse;
  } catch {
    throw new serverError(response.status, 'Invalid data');
  }
};
