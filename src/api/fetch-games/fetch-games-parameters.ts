import type { LibraryParameters } from '../../helpers/interfaces';
import type { GameCategory, SortType } from '../../helpers/types';

export const parameters: LibraryParameters = {
  featured: false,
  page: 1,
  limit: 10,
  category: 'all',
  sort: 'rating-desc',
};

export const updatePage = (page: number): LibraryParameters => {
  parameters.page = page;
  return parameters;
};

export const updateLimit = (limit: number): LibraryParameters => {
  parameters.limit = limit;
  return parameters;
};

export const updateCategory = (category: GameCategory): LibraryParameters => {
  parameters.category = category;
  return parameters;
};

export const updateSort = (sort: SortType): LibraryParameters => {
  parameters.sort = sort;
  return parameters;
};
