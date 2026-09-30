import { createHTMLElement } from '../../helpers/dom';
import './feedback-count.scss';

type feedbackType = 'rating' | 'likes';

export const feedbackCount = (
  type: feedbackType,
  count: number,
): HTMLElement => {
  const countText =
    type === 'rating'
      ? count.toString()
      : (Math.floor(count / 100) / 10).toFixed(1) + 'K';
  const classes =
    type === 'rating'
      ? 'feedback-count feedback-count--rating'
      : 'feedback-count feedback-count--likes';
  const item = createHTMLElement({
    tag: 'span',
    textContent: countText,
    classList: classes,
  });
  return item;
};
