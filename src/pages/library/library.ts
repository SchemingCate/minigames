import './library.scss';
import { header } from '../../components/header/header';
import { footer } from '../../components/footer/footer';
import { createHTMLElement } from '../../helpers/dom';
import { filterChips } from '../../components/filter-chips/filter-chips';
import { sortDropdown } from '../../components/sort-dropdown/sort-dropdown';
import { pagination } from '../../components/pagination/pagination';
import { gameModal } from '../../components/game-modal/game-modal';
import { fetchGames } from '../../api/fetch-games';
import { gameCard } from '../../components/game-card/game-card';

const loadGames = async (container: HTMLElement): Promise<void> => {
  try {
    const data = await fetchGames({ limit: 6 });
    console.log(data);
    const games = data.data;
    const itemsPerPage = data.meta.limit;
    for (let index = 0; index < itemsPerPage; index++) {
      container.append(gameCard(games[index]));
    }
  } catch (error) {
    console.error(error);
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

  pageContent.append(
    pageTitle,
    filterControls,
    gameCards,
    pagination(),
    gameModal(),
  );
  page.append(header('library'), pageContent, footer());

  void loadGames(gameCards);

  return page;
};
