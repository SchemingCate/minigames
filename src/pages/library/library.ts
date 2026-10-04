import './library.scss';
import { header } from '../../components/header/header';
import { footer } from '../../components/footer/footer';
import { createHTMLElement } from '../../helpers/dom';
import { filterChips } from '../../components/filter-chips/filter-chips';
import { sortDropdown } from '../../components/sort-dropdown/sort-dropdown';
import {
  pagination,
  updatePagination,
} from '../../components/pagination/pagination';
import { gameModal } from '../../components/game-modal/game-modal';
import { fetchGames } from '../../api/fetch-games/fetch-games';
import {
  createGameCard,
  fillGameCard,
} from '../../components/game-card/game-card';
import { errorBanner } from '../../components/error-banner/error-banner';
import { emptyStateBanner } from '../../components/empty-state-banner/empty-state-banner';
import { snackbar } from '../../components/snackbar/snackbar';
import { updateLimit } from '../../api/fetch-games/fetch-games-parameters';
import { snackbarContainer } from '../../components/snackbar/snackbar';

const cardsPerLibraryPage = 6;

const pageContent = createHTMLElement({ tag: 'main', classList: 'library' });

const gameCardsContainer = createHTMLElement({
  tag: 'div',
  classList: 'cards',
});

export type LoadGames = () => Promise<void>;

const loadGames = async (
  //TODO needs refactoring first :')
): Promise<void> => {
  const cards = Array.from({ length: cardsPerLibraryPage }, createGameCard);
  gameCardsContainer.replaceChildren('');
  for (const element of cards) gameCardsContainer.append(element);

  try {
    const data = await fetchGames();
    const games = data.data;

    const currentPage = data.meta.page;
    const totalPages = data.meta.totalPages;
    updatePagination(currentPage, totalPages);

    if (games.length === 0) {
      gameCardsContainer.replaceChildren(emptyStateBanner());
      return;
    }

    const itemsPerPage = data.meta.limit;
    const totalItems = data.meta.totalItems;
    const page = data.meta.page;
    const itemsOnCurrentPage = Math.min(
      itemsPerPage,
      totalItems - (page - 1) * itemsPerPage,
    );
    for (let index = 0; index < itemsPerPage; index++) {
      if (index < itemsOnCurrentPage) {
        fillGameCard(cards[index], games[index]);
        continue;
      }
      cards[index].remove();
    }

    snackbar('success', 'Success: Games loaded'); // TODO remove snackbar on when response doesn't need to have clarification
  } catch (error) {
    snackbar('error', 'Error: failed to load games');
    gameCardsContainer.replaceChildren(
      errorBanner(error, () => {
        gameCardsContainer.replaceChildren(...cards);
        void loadGames();
      }),
    );
  }
};

export const libraryPage = (): HTMLElement => {
  updateLimit(cardsPerLibraryPage);

  const page = createHTMLElement({ tag: 'div' });

  const pageTitle = createHTMLElement({
    tag: 'div',
    classList: 'library_page-title',
  });
  const pageTitleHeading = createHTMLElement({
    tag: 'h1',
    textContent: 'Game Library',
    classList: 'library_page-title_heading',
  });
  const pageTitleDescription = createHTMLElement({
    tag: 'p',
    textContent: 'Browse our collection of casual mini-games',
    classList: 'library_page-title_paragraph',
  });
  const filterControls = createHTMLElement({
    tag: 'div',
    classList: 'controls',
  });

  filterControls.append(filterChips(loadGames), sortDropdown(loadGames));
  pageTitle.append(pageTitleHeading, pageTitleDescription);

  const cards = Array.from({ length: cardsPerLibraryPage }, createGameCard);

  for (const element of cards) gameCardsContainer.append(element);

  pageContent.append(
    pageTitle,
    filterControls,
    gameCardsContainer,
    gameModal(),
    pagination(loadGames),
  );

  page.append(header('library'), pageContent, footer(), snackbarContainer);

  void loadGames();

  return page;
};
