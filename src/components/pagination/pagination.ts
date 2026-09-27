import './pagination.scss';
import { createHTMLElement } from '../../helpers/dom';

const pageCount = 4;

export const pagination = (): HTMLElement => {
  const pagination = createHTMLElement({
    tag: 'div',
    classList: 'pagination',
    attributes: [['aria-label', 'pagination']],
  });
  const previous = createHTMLElement({
    tag: 'button',
    textContent: '<',
    classList: 'pagination_button',
    attributes: [['disabled', '']],
  });
  pagination.append(previous);
  for (let index = 0; index < pageCount; index++) {
    const page = createHTMLElement({
      tag: 'button',
      textContent: (index + 1).toString(),
      classList: 'pagination_button',
    });
    if (index === 0) page.setAttribute('aria-current', 'page');
    pagination.append(page);
  }
  const next = createHTMLElement({
    tag: 'button',
    textContent: '>',
    classList: 'pagination_button',
  });
  pagination.append(next);
  return pagination;
};
