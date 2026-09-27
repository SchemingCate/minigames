import './pagination.scss';
import { createHTMLElement } from '../../helpers/dom';

const pageCount = 4;

export const pagination = (): HTMLElement => {
  const pagination = createHTMLElement({ tag: 'div' });
  const previous = createHTMLElement({ tag: 'button', textContent: '<' });
  pagination.append(previous);
  for (let index = 0; index < pageCount; index++) {
    const page = createHTMLElement({
      tag: 'button',
      textContent: (index + 1).toString(),
    });
    pagination.append(page);
  }
  const next = createHTMLElement({ tag: 'button', textContent: '>' });
  pagination.append(next);
  return pagination;
};
