import { homePage } from './pages/home/home-page';
import { libraryPage } from './pages/library/library';
import { modal } from './components/shared/modal/modal';

const pages = { home: homePage, library: libraryPage };
type PageName = keyof typeof pages;

const isPageName = (value: string | undefined): value is PageName =>
  value === 'home' || value === 'library';

export const renderPage = (root: HTMLElement, page: PageName): void => {
  root.replaceChildren(pages[page](), modal());
};

export const startApp = (
  root = document.querySelector<HTMLElement>('#app'),
): void => {
  if (!root) return;

  renderPage(root, 'home');

  root.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      'a[data-page]',
    );
    if (!link) return;

    event.preventDefault();

    const page = link.dataset.page;
    if (isPageName(page)) renderPage(root, page);
  });
};
