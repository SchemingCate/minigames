import './pagination.scss';
import { createHTMLElement } from '../../helpers/dom';
import type { LoadGames } from '../../pages/library/library';
import { updatePage } from '../../api/fetch-games/fetch-games-parameters';

const state = {
  currentPage: 1,
  totalPages: 1,
};

const pageNumbersContainer = createHTMLElement({ tag: 'div' });

export const pagination = (updateUI: LoadGames): HTMLElement => {
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
  const next = createHTMLElement({
    tag: 'button',
    textContent: '>',
    classList: 'pagination_button pagination_button--arrow',
    attributes: [['data-direction', 'next']],
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
      state.currentPage =
        buttonArrow.dataset.direction === 'previous'
          ? state.currentPage - 1
          : state.currentPage + 1;
    }

    if (button) {
      updatePage(Number(button.dataset.page));
    }

    // const allPagesButtons = pagination.querySelectorAll<HTMLButtonElement>(
    //   '.pagination_button--page',
    // );
    // const isFirstPage = state.currentPage === 1;
    // const isLastPage = state.currentPage === state.totalPages;
    // previous.toggleAttribute('disabled', isFirstPage);
    // next.toggleAttribute('disabled', isLastPage);

    // for (const pageButton of allPagesButtons) {
    //   if (pageButton.hasAttribute('aria-current'))
    //     pageButton.removeAttribute('aria-current');
    //   if (pageButton.dataset.page === state.currentPage.toString())
    //     pageButton.setAttribute('aria-current', 'page');
    // }
    void updateUI();
  });

  return pagination;
};

export const updatePagination = (
  currentPage: number,
  totalPages: number,
): void => {
  pageNumbersContainer.replaceChildren('');

  const firstPage = createHTMLElement({
    tag: 'button',
    textContent: '1',
    classList: 'pagination_button pagination_button--page',
    attributes: [['data-page', '1']],
  });

  if (totalPages === 0 || currentPage === 1)
    firstPage.setAttribute('aria-current', 'page');

  pageNumbersContainer.append(firstPage);

  for (let index = 1; index < totalPages; index++) {
    const pageNumber = index + 1;
    const page = createHTMLElement({
      tag: 'button',
      textContent: pageNumber.toString(),
      classList: 'pagination_button pagination_button--page',
      attributes: [['data-page', pageNumber.toString()]],
    });
    if (pageNumber === currentPage) page.setAttribute('aria-current', 'page');
    pageNumbersContainer.append(page);
  }
};
