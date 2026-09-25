import './style.scss';
import './pages/home/home-page';
import { homePage } from './pages/home/home-page';
import { libraryPage } from './pages/library/library';
import { modal } from './components/modal/modal';

const startApp = () => {
  const body = document.querySelector('#app');
  body?.append(homePage());
  body?.append(modal());

  body?.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      'a[data-page]',
    );
    if (!link) return;

    event.preventDefault();

    if (link.dataset.page === 'home') {
      body.replaceChildren();
      body?.append(homePage());
      body?.append(modal());
    } else if (link.dataset.page === 'library') {
      body.replaceChildren();
      body?.append(libraryPage());
      body?.append(modal());
    }
  });
};

startApp();
