export interface gameInfo {
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

export interface record {
  position: 1 | 2 | 3;
  playerName: string;
  score: number;
  achievedAt: string;
}

export interface gameSpecs {
  genre: string;
  players: string;
  duration: string;
  price: string;
}

export interface gameData {
  slug: string;
  name: string;
  heroImage: string;
  rating: number;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  fullDescription: string;
  specs: gameSpecs;
  topRecords: record[];
}
