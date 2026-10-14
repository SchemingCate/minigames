import './game-card.scss';

import { createHTMLElement } from '../../../helpers/dom';
import { getImageUrl } from '../../../helpers/get-image-url';

import {
  feedbackCountPlaceholder,
  fillFeedbackCount,
} from '../../shared/feedback-count/feedback-count';

import type { GameInfo } from '../../../helpers/interfaces';

export const createGameCard = () => {
  const card = createHTMLElement({
    tag: 'article',
    classList: 'card card--loading',
  });
  const heading = createHTMLElement({
    tag: 'h2',
    classList: 'card_content_title_heading',
  });
  const category = createHTMLElement({
    tag: 'span',
    classList: 'card_content_title_category',
  });
  const price = createHTMLElement({
    tag: 'span',
    classList: 'card_content_footer_price',
  });
  const description = createHTMLElement({
    tag: 'p',
    classList: 'card_content_description',
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
  const feedback = createHTMLElement({
    tag: 'div',
    classList: 'card_content_footer_feedback',
  });
  const image = createHTMLElement({
    tag: 'img',
  });

  const imageContainer = createHTMLElement({
    tag: 'div',
    classList: 'card_image card_image--loading',
  });
  imageContainer.append(image);
  const contentContainer = createHTMLElement({
    tag: 'div',
    classList: 'card_content',
  });

  const contentTitle = createHTMLElement({
    tag: 'div',
    classList: 'card_content_title',
  });
  contentTitle.append(heading, category);

  const rating = feedbackCountPlaceholder('rating');

  const likes = feedbackCountPlaceholder('likes');

  feedback.append(rating, likes);

  const footer = createHTMLElement({
    tag: 'div',
    classList: 'card_content_footer',
  });

  footer.append(feedback, price, detailsButton);

  contentContainer.append(contentTitle, description, footer);

  card.append(imageContainer, contentContainer);

  const fillGameCard = (info: GameInfo): void => {
    heading.textContent = info.name;
    category.textContent = info.category;
    price.textContent = info.price;
    description.textContent = info.shortDescription;

    detailsButton.dataset.game = info.slug;

    const feedbackCount = {
      likes: info.likesCount,
      rating: info.rating,
    };
    fillFeedbackCount(feedback, feedbackCount);

    card.classList.remove('card--loading');

    // TODO tackle unavailable image case
    image.setAttribute('src', getImageUrl(info.cardImage));
    image.setAttribute('alt', info.name);
  };

  return { card, fillGameCard };
};
