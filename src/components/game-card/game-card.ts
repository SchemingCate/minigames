import './game-card.scss';
import { createHTMLElement } from '../../helpers/dom';
import { getImageUrl } from '../../helpers/get-image-url';
import { feedbackCount } from '../feedback-count/feedback-count';
import type { GameInfo } from '../../helpers/interfaces';

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

  const rating = feedbackCount('rating', 4.9);

  const likes = feedbackCount('likes', 500);

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
  card.classList.remove('card--loading');
  const image = card.querySelector<HTMLImageElement>('#cardImage');
  image!.setAttribute('src', getImageUrl(info.cardImage));
  image!.setAttribute('alt', 'info.name');
};
