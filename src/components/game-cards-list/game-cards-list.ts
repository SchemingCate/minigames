import './game-cards-list.scss';
import { createHTMLElement } from '../../helpers/dom';
import { gameCard } from '../game-card/game-card';
import { gamesData } from '../../mock-data/games-data';
// import type { gameInfo } from '../../helpers/interfaces';

export const gameCardsList = (): HTMLElement => {
  const cards = createHTMLElement({ tag: 'div', classList: 'cards' });
  const games = gamesData;
  for (let index = 0; index < 6; index++) {
    cards.append(gameCard(games[index]));
  }
  return cards;
};
