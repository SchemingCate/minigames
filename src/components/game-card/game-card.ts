import './game-card.scss';
import { createHTMLElement } from '../../helpers/dom';
import { getImageUrl } from '../../helpers/get-image-url';
import {
  feedbackCountPlaceholder,
  fillFeedbackCount,
} from '../feedback-count/feedback-count';
import type { GameInfo } from '../../helpers/interfaces';
// import { button } from '../button/button';

// let button: HTMLButtonElement;

export const createGameCard = (): HTMLElement => {
  const card = createHTMLElement({
    tag: 'article',
    classList: 'card card--loading',
  });

  const imageContainer = createHTMLElement({
    tag: 'div',
    classList: 'card_image card_image--loading',
  });

  const image = createHTMLElement({
    tag: 'img',
    attributes: [['id', 'cardImage']],
  });
  imageContainer.append(image);

  const contentContainer = createHTMLElement({
    tag: 'div',
    classList: 'card_content',
  });
  const heading = createHTMLElement({
    tag: 'h2',
    classList: 'card_content_title_heading',
  });
  const category = createHTMLElement({
    tag: 'span',
    classList: 'card_content_title_category',
    // textContent: info.category,
  });
  const contentTitle = createHTMLElement({
    tag: 'div',
    classList: 'card_content_title',
  });
  contentTitle.append(heading, category);

  const description = createHTMLElement({
    tag: 'p',
    classList: 'card_content_description',
  });

  const rating = feedbackCountPlaceholder('rating');

  const likes = feedbackCountPlaceholder('likes');

  const feedback = createHTMLElement({
    tag: 'div',
    classList: 'card_content_footer_feedback',
  });
  feedback.append(rating, likes);
  const price = createHTMLElement({
    tag: 'span',
    classList: 'card_content_footer_price',
  });

  const detailsButton = createHTMLElement({
    tag: 'button',
    classList: 'card_content_footer_button',
    textContent: 'Details',
    attributes: [
      ['type', 'button'],
      ['command', 'show-modal'],
      ['commandfor', 'gameModal'],
    ],
  });

  // button = detailsButton;

  const footer = createHTMLElement({
    tag: 'div',
    classList: 'card_content_footer',
  });

  footer.append(feedback, price, detailsButton);

  contentContainer.append(contentTitle, description, footer);

  card.append(imageContainer, contentContainer);

  return card;
};

export const fillGameCard = (card: HTMLElement, info: GameInfo): void => {
  // TODO look into refactoring without !
  card.querySelector('.card_content_title_heading')!.textContent = info.name;
  card.querySelector('.card_content_title_category')!.textContent =
    info.category;
  card.querySelector('.card_content_footer_price')!.textContent = info.price;
  card.querySelector('.card_content_description')!.textContent =
    info.shortDescription;
  // button.setAttribute('dataset-game', info.slug);
  const button = card.querySelector<HTMLButtonElement>(
    '.card_content_footer_button',
  );
  if (button) {
    button.dataset.game = info.slug;
  }

  const feedbackContainer = card.querySelector<HTMLElement>(
    '.card_content_footer_feedback',
  );
  if (feedbackContainer) {
    const feedbackCount = {
      likes: info.likesCount,
      rating: info.rating,
    };
    fillFeedbackCount(feedbackContainer, feedbackCount);
  }
  card.classList.remove('card--loading');
  const image = card.querySelector<HTMLImageElement>('#cardImage');
  // TODO tackle unavailable image case
  image!.setAttribute('src', getImageUrl(info.cardImage));
  image!.setAttribute('alt', 'info.name');
};
