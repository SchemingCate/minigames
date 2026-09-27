import './game-cards-list.scss';
import { createHTMLElement } from '../../helpers/dom';
import { gameCard } from '../game-card/game-card';

export const gameCardsList = (): HTMLElement => {
  const cards = createHTMLElement({ tag: 'div', textContent: 'cards' });
  cards.append(gameCard());
  return cards;
};
