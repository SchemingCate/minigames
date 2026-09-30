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
    classList: 'pagination_button pagination_button--arrow',
    attributes: [
      ['disabled', ''],
      ['data-direction', 'previous'],
    ],
  });
  pagination.append(previous);
  let currentPage = 1;
  for (let index = 0; index < pageCount; index++) {
    const pageNumber = index + 1;
    const page = createHTMLElement({
      tag: 'button',
      textContent: pageNumber.toString(),
      classList: 'pagination_button pagination_button--page',
      attributes: [['data-page', pageNumber.toString()]],
    });
    if (index + 1 === currentPage) page.setAttribute('aria-current', 'page');
    pagination.append(page);
  }
  const next = createHTMLElement({
    tag: 'button',
    textContent: '>',
    classList: 'pagination_button pagination_button--arrow',
    attributes: [['data-direction', 'next']],
  });
  pagination.append(next);

  pagination.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      '.pagination_button--page',
    );

    const buttonArrow = (
      event.target as HTMLElement
    ).closest<HTMLButtonElement>('.pagination_button--arrow');

    if (!button && !buttonArrow) return;

    if (buttonArrow) {
      currentPage =
        buttonArrow.dataset.direction === 'previous'
          ? currentPage - 1
          : currentPage + 1;
    }

    if (button) {
      currentPage = Number(button.dataset.page);
    }

    const allPagesButtons = pagination.querySelectorAll<HTMLButtonElement>(
      '.pagination_button--page',
    );
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === pageCount;
    previous.toggleAttribute('disabled', isFirstPage);
    next.toggleAttribute('disabled', isLastPage);

    for (const pageButton of allPagesButtons) {
      if (pageButton.hasAttribute('aria-current'))
        pageButton.removeAttribute('aria-current');
      if (pageButton.dataset.page === currentPage.toString())
        pageButton.setAttribute('aria-current', 'page');
    }
  });

  return pagination;
};
