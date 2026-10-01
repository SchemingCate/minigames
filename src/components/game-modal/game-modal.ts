import './game-modal.scss';
import { createHTMLElement } from '../../helpers/dom';
import { getImageUrl } from '../../helpers/get-image-url';
import { feedbackCount } from '../feedback-count/feedback-count';
import { recordsTable } from '../records-table/records-table';

import type { GameData } from '../../helpers/interfaces';
import type { GameSpecs } from '../../helpers/interfaces';

const gameData: GameData = {
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

  const mainContent = createHTMLElement({
    tag: 'div',
    classList: 'game-modal_content_main',
  });
  const gameHeader = createHTMLElement({
    tag: 'div',
    classList: 'game-modal_content_main_header',
  });
  const gameTitle = createHTMLElement({
    tag: 'h2',
    textContent: gameData.name,
    classList: 'game-modal_content_main_header_title',
  });

  const feedback = createHTMLElement({
    tag: 'div',
    classList: 'game-modal_content_main_header_feedback',
  });
  feedback.append(
    feedbackCount('rating', gameData.rating),
    feedbackCount('likes', gameData.likesCount),
  );

  gameHeader.append(gameTitle, feedback);

  const gameSpecs = createHTMLElement({
    tag: 'dl',
    classList: 'game-modal_content_main_specs',
  });
  for (const [spec, value] of Object.entries(gameData.specs) as [
    keyof GameSpecs,
    string,
  ][]) {
    const item = createHTMLElement({
      tag: 'div',
      classList: 'game-modal_content_main_specs_item',
    });
    const specElement = createHTMLElement({
      tag: 'dt',
      textContent: spec,
      classList: 'game-modal_content_main_specs_item_name',
    });
    const valueElement = createHTMLElement({
      tag: 'dd',
      textContent: value,
      classList: 'game-modal_content_main_specs_item_value',
    });
    item.append(specElement, valueElement);
    gameSpecs.append(item);
  }

  const gameDescription = createHTMLElement({
    tag: 'p',
    textContent: gameData.fullDescription,
    classList: 'game-modal_content_main_description',
  });

  const action = createHTMLElement({
    tag: 'div',
    classList: 'game-modal_content_main_action',
  });
  const playButton = createHTMLElement({
    tag: 'button',
    textContent: 'Play now',
    classList: 'game-modal_content_main_action_play',
  });
  const favButton = createHTMLElement({
    tag: 'button',
    textContent: 'Add to favorites',
    classList: 'game-modal_content_main_action_favorite',
  });
  action.append(playButton, favButton);

  const records = createHTMLElement({
    tag: 'div',
    classList: 'game-modal_content_main_records',
  });
  const recordsHeader = createHTMLElement({
    tag: 'h2',
    textContent: '🏆 Top Records',
    classList: 'game-modal_content_main_records_heading',
  });

  records.append(recordsHeader, recordsTable(gameData.topRecords));

  mainContent.append(gameHeader, gameDescription, gameSpecs, action, records);
  content.append(closeButton, hero, mainContent);
  gameModal.append(content);

  gameModal.addEventListener('click', (event) => {
    if (event.target === gameModal) gameModal.close();
  });

  return gameModal;
};
