import { createHTMLElement } from '../../helpers/dom';
import './feedback-count.scss';

import type { GameInfo } from '../../helpers/interfaces';

type feedbackType = 'rating' | 'likes';

export const feedbackCountPlaceholder = (
  //TODO naming - feedbackItem?
  type: feedbackType,
): HTMLElement => {
  // const countText =
  //   type === 'rating'
  //     ? count.toString()
  //     : (Math.floor(count / 100) / 10).toFixed(1) + 'K';
  const classes =
    type === 'rating'
      ? 'feedback-count feedback-count--rating'
      : 'feedback-count feedback-count--likes';
  const item = createHTMLElement({
    tag: 'span',
    // textContent: countText,
    classList: classes,
  });

  const placeholder = createHTMLElement({
    tag: 'div',
    textContent: 'placeholder',
  });
  item.append(placeholder);

  return item;
};

export const fillFeedbackCount = (
  container: HTMLElement,
  info: GameInfo,
): void => {
  const rating = container.querySelector('.feedback-count--rating');
  const likes = container.querySelector('.feedback-count--likes');
  if (rating) rating.textContent = info.rating.toString();
  if (likes)
    likes.textContent =
      (Math.floor(info.likesCount / 100) / 10).toFixed(1) + 'K';
};
