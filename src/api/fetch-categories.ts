import { networkError, serverError } from './errors';

import type { CategoriesResponse } from '../helpers/interfaces';

export const fetchCategories = async (): Promise<CategoriesResponse> => {
  let response: Response;
  try {
    response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
  } catch {
    throw new networkError();
  }
  if (!response.ok) {
    throw new serverError(response.status);
  }

  try {
    return (await response.json()) as CategoriesResponse;
  } catch {
    throw new serverError(response.status, 'Invalid data');
  }
};
