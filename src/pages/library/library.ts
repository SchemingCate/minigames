import './library.scss';
import { header } from '../../components/header/header';
import { footer } from '../../components/footer/footer';
import { createHTMLElement } from '../../helpers/dom';
import { filterChips } from '../../components/filter-chips/filter-chips';
import { sortDropdown } from '../../components/sort-dropdown/sort-dropdown';
import { pagination } from '../../components/pagination/pagination';
import { gameModal } from '../../components/game-modal/game-modal';
import { fetchGames } from '../../api/fetch-games';
import {
  createGameCard,
  fillGameCard,
} from '../../components/game-card/game-card';
import { errorBanner } from '../../components/error-banner/error-banner';
import { emptyStateBanner } from '../../components/empty-state-banner/empty-state-banner';
import { snackbar } from '../../components/snackbar/snackbar';
import type { LibraryParameters } from '../../helpers/interfaces';

const cardsPerLibraryPage = 6;

const gameCardsContainer = createHTMLElement({
  tag: 'div',
  classList: 'cards',
});

const snackbarContainer = createHTMLElement({
  tag: 'div',
  classList: 'snackbars',
});

export type LoadGames = (parameters: LibraryParameters) => Promise<void>;

const loadGames: LoadGames = async (
  //TODO needs refactoring first :')
  parameters: LibraryParameters,
): Promise<void> => {
  const cards = Array.from({ length: cardsPerLibraryPage }, createGameCard);
  gameCardsContainer.replaceChildren('');
  for (const element of cards) gameCardsContainer.append(element);

  try {
    const data = await fetchGames(parameters);
    const games = data.data;

    if (games.length === 0) {
      gameCardsContainer.replaceChildren(emptyStateBanner());
      return;
    }

    const itemsPerPage = data.meta.limit;
    const totalItems = data.meta.totalItems;
    for (let index = 0; index < itemsPerPage; index++) {
      if (index < totalItems) {
        fillGameCard(cards[index], games[index]);
        continue;
      }
      cards[index].remove();
      console.log('cards[index]');
      console.log(cards[index]);
    }

    snackbarContainer.append(snackbar('success', 'Success: Games loaded')); // TODO remove snackbar on when response doesn't need to have clarification
  } catch (error) {
    console.error(error);
    snackbarContainer.append(snackbar('error', 'Error: failed to load games'));
    gameCardsContainer.replaceChildren(
      errorBanner(error, () => {
        gameCardsContainer.replaceChildren(...cards);
        void loadGames(parameters);
      }),
    );
  }
};

export const libraryPage = (): HTMLElement => {
  const page = createHTMLElement({ tag: 'div' });
  const pageContent = createHTMLElement({ tag: 'main', classList: 'library' });
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

  filterControls.append(
    filterChips(snackbarContainer, loadGames, { limit: cardsPerLibraryPage }),
    sortDropdown(),
  );
  pageTitle.append(pageTitleHeading, pageTitleDescription);

  const cards = Array.from({ length: cardsPerLibraryPage }, createGameCard);

  for (const element of cards) gameCardsContainer.append(element);

  pageContent.append(
    pageTitle,
    filterControls,
    gameCardsContainer,
    pagination(),
    gameModal(),
  );
  // snackbarContainer.append(snackbar());
  page.append(header('library'), pageContent, footer(), snackbarContainer);

  void loadGames({ limit: cardsPerLibraryPage });

  return page;
};
