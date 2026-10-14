import './pagination.scss';
import { createHTMLElement } from '../../../helpers/dom';
import type { LoadGames } from '../../../pages/library/library';
import {
  parameters,
  updatePage,
} from '../../../api/fetch-games/fetch-games-parameters';

const pageNumbersContainer = createHTMLElement({
  tag: 'div',
  classList: 'pagination_container',
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

const next = createHTMLElement({
  tag: 'button',
  textContent: '>',
  classList: 'pagination_button pagination_button--arrow',
  attributes: [
    ['disabled', ''],
    ['data-direction', 'next'],
  ],
});

export const pagination = (updateUI: LoadGames): HTMLElement => {
  const pagination = createHTMLElement({
    tag: 'div',
    classList: 'pagination',
    attributes: [['aria-label', 'pagination']],
  });

  pagination.append(previous, pageNumbersContainer, next);

  const page = createHTMLElement({
    tag: 'button',
    textContent: '1',
    classList: 'pagination_button pagination_button--page',
    attributes: [
      ['data-page', '1'],
      ['aria-current', 'page'],
    ],
  });
  pageNumbersContainer.append(page);

  pagination.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      '.pagination_button--page',
    );

    const buttonArrow = (
      event.target as HTMLElement
    ).closest<HTMLButtonElement>('.pagination_button--arrow');

    if (!button && !buttonArrow) return;

    if (buttonArrow) {
      const page =
        buttonArrow.dataset.direction === 'previous'
          ? parameters.page - 1
          : parameters.page + 1;
      updatePage(page);
    }

    if (button) {
      updatePage(Number(button.dataset.page));
    }

    void updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  return pagination;
};

export const updatePagination = (
  currentPage: number,
  totalPages: number,
): void => {
  pageNumbersContainer.replaceChildren('');

  if (totalPages <= 1) {
    const firstPage = createHTMLElement({
      tag: 'button',
      textContent: '1',
      classList: 'pagination_button pagination_button--page',
      attributes: [['data-page', '1']],
    });

    pageNumbersContainer.append(firstPage);

    firstPage.setAttribute('aria-current', 'page');

    previous.setAttribute('disabled', '');
    next.setAttribute('disabled', '');
    return;
  }

  const threshold = globalThis.matchMedia('(max-width: 425px)');

  const maxVisible = threshold.matches ? 3 : 4;

  const count = Math.min(maxVisible, totalPages);

  let start = currentPage - Math.floor((count - 1) / 2);

  start = Math.max(1, Math.min(start, totalPages - count + 1));

  const visiblePagesNumbers = Array.from(
    { length: count },
    (_, index) => start + index,
  );

  for (const pageNumber of visiblePagesNumbers) {
    const page = createHTMLElement({
      tag: 'button',
      textContent: pageNumber.toString(),
      classList: 'pagination_button pagination_button--page',
      attributes: [['data-page', pageNumber.toString()]],
    });
    if (pageNumber === currentPage) page.setAttribute('aria-current', 'page');
    pageNumbersContainer.append(page);
  }

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  previous.toggleAttribute('disabled', isFirstPage);
  next.toggleAttribute('disabled', isLastPage);

  threshold.addEventListener('change', () => {
    updatePagination(currentPage, totalPages);
  });
};
