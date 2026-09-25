import './style.scss';
import './pages/home/home-page';
import { homePage } from './pages/home/home-page';
import { modal } from './components/modal/modal';

const startApp = () => {
  const body = document.querySelector('#app');
  body?.append(homePage());
  body?.append(modal());
};

startApp();
