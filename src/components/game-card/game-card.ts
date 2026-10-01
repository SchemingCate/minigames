import './game-card.scss';
import { createHTMLElement } from '../../helpers/dom';
import { getImageUrl } from '../../helpers/get-image-url';
import { feedbackCount } from '../feedback-count/feedback-count';
import type { GameInfo } from '../../helpers/interfaces';

export const gameCard = (info: GameInfo): HTMLElement => {
  const card = createHTMLElement({
    tag: 'article',
    classList: 'card',
  });

  const imageContainer = createHTMLElement({
    tag: 'div',
    classList: 'card_image',
  });

  const imgUrl = getImageUrl(info.cardImage);
  const image = createHTMLElement({
    tag: 'img',
    attributes: [
      ['src', imgUrl],
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

  const rating = feedbackCount('rating', info.rating);

  const likes = feedbackCount('likes', info.likesCount);

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
    attributes: [
      ['type', 'button'],
      ['command', 'show-modal'],
      ['commandfor', 'gameModal'],
    ],
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
