import './game-card.scss';
import { createHTMLElement } from '../../helpers/dom';

import type { gameInfo } from '../../helpers/interfaces';

export const gameCard = (info: gameInfo): HTMLElement => {
  const card = createHTMLElement({
    tag: 'article',
    classList: 'card',
  });

  const imageContainer = createHTMLElement({
    tag: 'div',
    classList: 'card_image',
  });

  const image = createHTMLElement({
    tag: 'img',
    attributes: [
      ['src', `./src${info.cardImage}`],
      ['alt', info.name],
    ],
  });
  imageContainer.append(image);

  const contentContainer = createHTMLElement({
    tag: 'div',
    classList: 'card_content',
  });
  const heading = createHTMLElement({
    tag: 'h2',
    classList: 'card_content_title_heading',
    textContent: info.name,
  });
  const category = createHTMLElement({
    tag: 'span',
    classList: 'card_content_title_category',
    textContent: info.category,
  });
  const contentTitle = createHTMLElement({
    tag: 'div',
    classList: 'card_content_title',
  });
  contentTitle.append(heading, category);

  const description = createHTMLElement({
    tag: 'p',
    classList: 'card_content_description',
    textContent: info.shortDescription,
  });

  const rating = createHTMLElement({
    tag: 'span',
    classList:
      'card_content_footer_feedback_item card_content_footer_feedback_item--rating',
    textContent: info.rating.toString(),
  });
  const likes = createHTMLElement({
    tag: 'span',
    classList:
      'card_content_footer_feedback_item card_content_footer_feedback_item--likes',
    textContent: (Math.floor(info.likesCount / 100) / 10).toFixed(1) + 'K',
  });
  const feedback = createHTMLElement({
    tag: 'div',
    classList: 'card_content_footer_feedback',
  });
  feedback.append(rating, likes);
  const price = createHTMLElement({
    tag: 'span',
    classList: 'card_content_footer_price',
    textContent: info.price,
  });
  if (info.price === 'Free')
    price.classList.add('card_content_footer_price--free');
  const detailsButton = createHTMLElement({
    tag: 'button',
    classList: 'card_content_footer_button',
    textContent: 'Details',
  });
  const footer = createHTMLElement({
    tag: 'div',
    classList: 'card_content_footer',
  });

  footer.append(feedback, price, detailsButton);

  contentContainer.append(contentTitle, description, footer);

  card.append(imageContainer, contentContainer);

  return card;
};
