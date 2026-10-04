import './game-modal.scss';
import { createHTMLElement } from '../../helpers/dom';
import { getImageUrl } from '../../helpers/get-image-url';
import { feedbackCountPlaceholder } from '../feedback-count/feedback-count';
// import { recordsTable } from '../records-table/records-table';
import type { GameParameters } from '../../helpers/interfaces';
import { fetchGameDetails } from '../../api/fetch-game-details';
import { fillFeedbackCount } from '../feedback-count/feedback-count';
import {
  fillRecordsTable,
  recordsTablePlaceholder,
} from '../records-table/records-table';
import { errorBanner } from '../error-banner/error-banner';

interface CommandEvent extends Event {
  readonly command: string;
  readonly source: Element | null;
}

const gameModalDialog = createHTMLElement({
  tag: 'dialog',
  attributes: [['id', 'gameModal']],
  classList: 'game-modal game-modal--loading',
});

const heroImage = createHTMLElement({
  tag: 'img',
  attributes: [],
});

const gameTitle = createHTMLElement({
  tag: 'h2',
  classList: 'game-modal_content_main_header_title',
});

const gameDescription = createHTMLElement({
  tag: 'p',
  classList: 'game-modal_content_main_description',
});

const feedback = createHTMLElement({
  tag: 'div',
  classList: 'game-modal_content_main_header_feedback',
});

const gameSpecs = createHTMLElement({
  tag: 'dl',
  classList: 'game-modal_content_main_specs',
});

const specValueElements: HTMLElement[] = [];

export const gameModal = (): HTMLElement => {
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

  hero.append(heroImage);

  const mainContent = createHTMLElement({
    tag: 'div',
    classList: 'game-modal_content_main',
  });
  const gameHeader = createHTMLElement({
    tag: 'div',
    classList: 'game-modal_content_main_header',
  });

  feedback.append(
    feedbackCountPlaceholder('rating'),
    feedbackCountPlaceholder('likes'),
  );

  gameHeader.append(gameTitle, feedback);

  const gameSpecsValuesNames = ['Genre', 'Players', 'Duration', 'Price'];

  for (const valueName of gameSpecsValuesNames) {
    const item = createHTMLElement({
      tag: 'div',
      classList: 'game-modal_content_main_specs_item',
    });
    const specElement = createHTMLElement({
      tag: 'dt',
      classList: 'game-modal_content_main_specs_item_name',
      textContent: valueName,
    });
    const valueElement = createHTMLElement({
      tag: 'dd',
      classList: 'game-modal_content_main_specs_item_value',
      attributes: [
        ['data-value', 'true'],
        ['data-valuekey', valueName],
      ],
    });
    specValueElements.push(valueElement);
    item.append(specElement, valueElement);
    gameSpecs.append(item);
  }

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

  records.append(recordsHeader, recordsTablePlaceholder());

  mainContent.append(gameHeader, gameDescription, gameSpecs, action, records);
  content.append(closeButton, hero, mainContent);
  gameModalDialog.append(content);

  gameModalDialog.addEventListener('click', (event) => {
    if (event.target !== gameModalDialog) {
      return;
    }
    gameModalDialog.close();
    gameModalDialog.classList.add('game-modal--loading');
  });

  gameModalDialog.addEventListener('command', (event) => {
    const { command, source } = event as CommandEvent;
    if (command !== 'show-modal' || !(source instanceof HTMLElement)) return;

    if (source.dataset.game) {
      void updateGameModal({ gameSlug: source.dataset.game });
    }
  });

  return gameModalDialog;
};

export const updateGameModal = async (parameters: GameParameters) => {
  try {
    const data = await fetchGameDetails(parameters);
    const gameDetails = data.data;

    gameModalDialog.classList.remove('game-modal--loading');

    heroImage.src = getImageUrl(gameDetails.heroImage);
    heroImage.alt = gameDetails.name;
    gameTitle.textContent = gameDetails.name;
    gameDescription.textContent = gameDetails.fullDescription;
    fillFeedbackCount(feedback, {
      likes: gameDetails.likesCount,
      rating: gameDetails.rating,
    });

    const cont = gameSpecs.querySelectorAll<HTMLElement>(
      '.game-modal_content_main_specs_item_value[data-value="true"]',
    );
    cont.forEach((element) => {
      if (!element.dataset.valuekey) return;
      switch (element.dataset.valuekey.toLowerCase()) {
        case 'genre': {
          element.textContent = gameDetails.specs['genre'];
          break;
        }
        case 'players': {
          element.textContent = gameDetails.specs['players'];
          break;
        }
        case 'duration': {
          element.textContent = gameDetails.specs['duration'];
          break;
        }
        case 'price': {
          element.textContent = gameDetails.specs['price'];
        }
      }
    });

    fillRecordsTable(gameDetails.topRecords);

    // success - snack bar info ?
  } catch (error) {
    // error = snackbar error ?
    gameModalDialog.classList.remove('game-modal--loading');
    gameModalDialog.append(
      errorBanner(error, () => {
        void updateGameModal(parameters);
      }),
    );
  }
};
