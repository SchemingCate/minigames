import './game-card.scss';
import { createHTMLElement } from '../../helpers/dom';

export const gameCard = (): HTMLElement => {
  const card = createHTMLElement({
    tag: 'article',
    classList: 'card',
  });

  const imageContainer = createHTMLElement({
    tag: 'div',
    classList: 'card_image',
  });

  const contentContainer = createHTMLElement({
    tag: 'div',
    classList: 'card_content',
  });
  const heading = createHTMLElement({
    tag: 'h2',
    classList: 'card_content_title_heading',
    textContent: 'Vacation Cafe Simulator',
  });
  const category = createHTMLElement({
    tag: 'span',
    classList: 'card_content_title_category',
    textContent: 'strategy',
  });
  const contentTitle = createHTMLElement({
    tag: 'div',
    classList: 'card_content_title',
  });
  contentTitle.append(heading, category);

  const description = createHTMLElement({
    tag: 'p',
    classList: 'card_content_description',
    textContent:
      'Cozy Italian Vacation Cafe 🏖️ No timers, No stress 😌 cook traditional dishes 🍝 upgrade and customize 🏠 just drink Prosecco 🥂 relax and grow your dream cafe ✨',
  });

  const rating = createHTMLElement({
    tag: 'span',
    classList:
      'card_content_footer_feedback_item card_content_footer_feedback_item--rating',
    textContent: '4.8',
  });
  const likes = createHTMLElement({
    tag: 'span',
    classList:
      'card_content_footer_feedback_item card_content_footer_feedback_item--likes',
    textContent: '28.75K',
  });
  const feedback = createHTMLElement({
    tag: 'div',
    classList: 'card_content_footer_feedback',
  });
  feedback.append(rating, likes);
  const price = createHTMLElement({
    tag: 'span',
    classList: 'card_content_footer_price',
    textContent: 'Free',
  });
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
