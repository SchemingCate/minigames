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

const cardsPerLibraryPage = 6;

const loadGames = async (
  container: HTMLElement,
  cards: HTMLElement[],
): Promise<void> => {
  try {
    const data = await fetchGames({ limit: cardsPerLibraryPage });
    const games = data.data;

    if (games.length === 0) {
      container.replaceChildren(emptyStateBanner());
      return;
    }
    const itemsPerPage = data.meta.limit;
    for (let index = 0; index < itemsPerPage; index++) {
      fillGameCard(cards[index], games[index]);
    }
  } catch (error) {
    container.replaceChildren(
      errorBanner(error, () => {
        container.replaceChildren(...cards);
        void loadGames(container, cards);
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
  filterControls.append(filterChips(), sortDropdown());
  pageTitle.append(pageTitleHeading, pageTitleDescription);

  const gameCards = createHTMLElement({ tag: 'div', classList: 'cards' });
  const cards = Array.from({ length: cardsPerLibraryPage }, createGameCard);
  for (const element of cards) gameCards.append(element);

  pageContent.append(
    pageTitle,
    filterControls,
    gameCards,
    pagination(),
    gameModal(),
  );
  page.append(header('library'), pageContent, footer());

  void loadGames(gameCards, cards);

  return page;
};
