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
    const pageNumber = index + 1;
    const page = createHTMLElement({
      tag: 'button',
      textContent: pageNumber.toString(),
      classList: 'pagination_button pagination_button--page',
      attributes: [['data-page', pageNumber.toString()]],
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

  pagination.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      '.pagination_button--page',
    );
    if (!button) return;

    const allPagesButtons = pagination.querySelectorAll(
      '.pagination_button--page',
    );
    for (const pageButton of allPagesButtons) {
      if (pageButton.hasAttribute('aria-current'))
        pageButton.removeAttribute('aria-current');
    }
    button.setAttribute('aria-current', 'page');
  });

  return pagination;
};
