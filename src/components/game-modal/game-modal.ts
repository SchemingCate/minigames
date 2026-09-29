import './game-modal.scss';
import { createHTMLElement } from '../../helpers/dom';
import { getImageUrl } from '../../helpers/get-image-url';
import { feedbackCount } from '../feedback-count/feedback-count';

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
      ['aria-label', 'close modal'],
    ],
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

  const gameInfo = createHTMLElement({ tag: 'div' });
  const gameHeading = createHTMLElement({
    tag: 'div',
  });
  const gameName = createHTMLElement({
    tag: 'h2',
    textContent: gameData.name,
  });

  const feedback = createHTMLElement({ tag: 'div' });
  feedback.append(
    feedbackCount('rating', gameData.rating),
    feedbackCount('likes', gameData.likesCount),
  );

  gameHeading.append(gameName, feedback);

  const gameSpecs = createHTMLElement({ tag: 'dl' });
  for (const [spec, value] of Object.entries(gameData.specs)) {
    const item = createHTMLElement({ tag: 'div' });
    const specElement = createHTMLElement({ tag: 'dt', textContent: spec });
    const valueElement = createHTMLElement({ tag: 'dd', textContent: value });
    item.append(specElement, valueElement);
    gameSpecs.append(item);
  }

  const gameDescription = createHTMLElement({
    tag: 'p',
    textContent: gameData.fullDescription,
  });
  gameInfo.append(gameHeading, gameDescription, gameSpecs);

  const action = createHTMLElement({ tag: 'div' });
  const playButton = createHTMLElement({
    tag: 'button',
    textContent: 'Play now',
  });
  const favButton = createHTMLElement({
    tag: 'button',
    textContent: 'Add to favorites',
  });
  action.append(playButton, favButton);

  content.append(closeButton, hero, gameInfo, action);
  gameModal.append(content);

  gameModal.addEventListener('click', (event) => {
    if (event.target === gameModal) gameModal.close();
  });

  return gameModal;
};
