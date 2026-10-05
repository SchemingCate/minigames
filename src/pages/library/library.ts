import './library.scss';
import { header } from '../../components/shared/header/header';
import { footer } from '../../components/shared/footer/footer';
import { createHTMLElement } from '../../helpers/dom';
import { filterChips } from '../../components/for-library-page/filter-chips/filter-chips';
import { sortDropdown } from '../../components/for-library-page/sort-dropdown/sort-dropdown';
import {
  pagination,
  updatePagination,
} from '../../components/for-library-page/pagination/pagination';
import { gameModal } from '../../components/shared/game-modal/game-modal';
import { fetchGames } from '../../api/fetch-games/fetch-games';
import { createGameCard } from '../../components/for-library-page/game-card/game-card';
import { errorBanner } from '../../components/shared/error-banner/error-banner';
import { emptyStateBanner } from '../../components/shared/empty-state-banner/empty-state-banner';
import { snackbar } from '../../components/shared/snackbar/snackbar';
import { updateLimit } from '../../api/fetch-games/fetch-games-parameters';
import { snackbarContainer } from '../../components/shared/snackbar/snackbar';

const CARDS_PER_PAGE_DEFAULT = 6;

const pageContent = createHTMLElement({ tag: 'main', classList: 'library' });

const gameCardsContainer = createHTMLElement({
  tag: 'div',
  classList: 'cards',
});

export type LoadGames = () => Promise<void>;

const loadGames = async (
  //TODO needs refactoring first :')
): Promise<void> => {
  const instances = Array.from({ length: CARDS_PER_PAGE_DEFAULT }, () =>
    createGameCard(),
  );
  const cards = instances.map(({ card }) => card);
  gameCardsContainer.replaceChildren('');
  gameCardsContainer.replaceChildren(...cards);

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
        instances[index].fillGameCard(games[index]);
        continue;
      }
      instances[index].card.remove();
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
  pageContent.replaceChildren();
  gameCardsContainer.replaceChildren();

  updateLimit(CARDS_PER_PAGE_DEFAULT);

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

  const instances = Array.from({ length: CARDS_PER_PAGE_DEFAULT }, () =>
    createGameCard(),
  );
  const cards = instances.map(({ card }) => card);

  gameCardsContainer.replaceChildren(...cards);

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
