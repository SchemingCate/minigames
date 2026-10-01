import { createHTMLElement } from '../../helpers/dom';
import './feedback-count.scss';

import type { GameInfo } from '../../helpers/interfaces';

type feedbackType = 'rating' | 'likes';

export const feedbackCountPlaceholder = (
  //TODO naming - feedbackItem?
  type: feedbackType,
): HTMLElement => {
  const classes =
    type === 'rating'
      ? 'feedback-count feedback-count--loading feedback-count--rating'
      : 'feedback-count feedback-count--loading feedback-count--likes';
  const item = createHTMLElement({
    tag: 'span',
    classList: classes,
  });

  const placeholder = createHTMLElement({
    tag: 'div',
  });
  item.append(placeholder);

  return item;
};

export const fillFeedbackCount = (
  container: HTMLElement,
  info: GameInfo,
): void => {
  const rating = container.querySelector('.feedback-count--rating');
  rating?.classList.remove('feedback-count--loading');
  const likes = container.querySelector('.feedback-count--likes');
  likes?.classList.remove('feedback-count--loading');
  if (rating) rating.textContent = info.rating.toString();
  if (likes)
    likes.textContent =
      (Math.floor(info.likesCount / 100) / 10).toFixed(1) + 'K';
};
