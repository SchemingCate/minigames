import './game-modal.scss';
import { createHTMLElement } from '../../helpers/dom';
import { getImageUrl } from '../../helpers/get-image-url';

const gameData = {
  slug: 'tukoni-forest-keepers',
  name: 'Tukoni: Forest Keepers',
  heroImage: '/assets/images/games/tukoni-forest-keepers-hero.jpg',
  rating: 4.9,
  likesCount: 31_200,
  isLikedByCurrentUser: false,
  fullDescription:
    'Tukoni: Forest Keepers — a cozy hand-drawn puzzle-adventure. You are Traveller, a little forest spirit on an important mission. Wander storybook meadows, visit mushroom villages, meet adorable inhabitants, solve gentle hand-crafted puzzles, brew herbal teas and help the Tukoni forest prepare peacefully for the coming winter.',
  specs: {
    genre: 'Puzzle',
    players: 'Solo',
    duration: '40-90 min',
    price: 'Free',
  },
  topRecords: [
    {
      position: 1,
      playerName: 'ForestSpirit',
      score: 356_700,
      achievedAt: '2026-08-28T14:30:00Z',
    },
    {
      position: 2,
      playerName: 'TeaBrewer',
      score: 332_400,
      achievedAt: '2026-08-25T09:12:00Z',
    },
    {
      position: 3,
      playerName: 'HerbalistPath',
      score: 308_900,
      achievedAt: '2026-08-23T18:45:00Z',
    },
  ],
};

export const gameModal = (): HTMLElement => {
  const gameModal = createHTMLElement({
    tag: 'dialog',
    attributes: [['id', 'gameModal']],
    classList: 'game-modal',
  });

  const content = createHTMLElement({
    tag: 'div',
    classList: 'game-modal_content',
  });

  const closeButton = createHTMLElement({
    tag: 'button',
    attributes: [
      ['commandfor', 'gameModal'],
      ['command', 'close'],
    ],
    textContent: 'Close',
    classList: 'game-modal_content_button',
  });

  const hero = createHTMLElement({
    tag: 'div',
    classList: 'game-modal_content_hero',
  });
  const heroImage = createHTMLElement({
    tag: 'img',
    attributes: [
      ['src', getImageUrl(gameData.heroImage)],
      ['alt', gameData.name],
    ],
  });
  hero.append(heroImage);

  content.append(closeButton, hero);
  gameModal.append(content);

  gameModal.addEventListener('click', (event) => {
    if (event.target === gameModal) gameModal.close();
  });

  return gameModal;
};
