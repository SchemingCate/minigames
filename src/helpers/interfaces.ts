import type { SortType, GameCategory } from './types';

export interface GameInfo {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  rating: number;
  likesCount: number;
  cardImage: string;
  featured: boolean;
}

export interface LibraryParameters {
  featured?: boolean;
  page?: number;
  limit?: number;
  category?: GameCategory;
  sort?: SortType;
}

export interface FilterValues {
  category: GameCategory;
  sort: SortType;
}

export interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  appliedFilter: FilterValues;
}

export interface GameListResponse {
  data: GameInfo[];
  meta: Meta;
  additionalProp1?: object;
}

export interface Record {
  position: 1 | 2 | 3;
  playerName: string;
  score: number;
  achievedAt: string;
}

export interface GameSpecs {
  genre: string;
  players: string;
  duration: string;
  price: string;
}

export interface GameData {
  slug: string;
  name: string;
  heroImage: string;
  rating: number;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  fullDescription: string;
  specs: GameSpecs;
  topRecords: Record[];
}
