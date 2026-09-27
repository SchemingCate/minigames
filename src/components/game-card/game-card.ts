import { createHTMLElement } from '../../helpers/dom';

export const gameCard = (): HTMLElement => {
  const card = createHTMLElement({
    tag: 'article',
    textContent: 'card',
    classList: '.card',
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
    classList: 'card_content_heading',
    textContent: 'Vacation Cafe Simulator',
  });
  const category = createHTMLElement({
    tag: 'span',
    classList: 'card_content_category',
    textContent: 'strategy',
  });
  const description = createHTMLElement({
    tag: 'p',
    classList: 'card_content_description',
    textContent:
      'Cozy Italian Vacation Cafe 🏖️ No timers, No stress 😌 cook traditional dishes 🍝 upgrade and customize 🏠 just drink Prosecco 🥂 relax and grow your dream cafe ✨',
  });
  const rating = createHTMLElement({
    tag: 'span',
    classList: 'card_content_rating',
    textContent: '4.8',
  });
  const likes = createHTMLElement({
    tag: 'span',
    classList: 'card_content_likes',
    textContent: '28.75K',
  });
  const price = createHTMLElement({
    tag: 'span',
    classList: 'card_content_price',
    textContent: 'Free',
  });
  const detailsButton = createHTMLElement({
    tag: 'button',
    classList: 'card_content_button',
    textContent: 'Details',
  });

  contentContainer.append(
    heading,
    category,
    description,
    rating,
    likes,
    price,
    detailsButton,
  );

  card.append(imageContainer, contentContainer);

  return card;
};
