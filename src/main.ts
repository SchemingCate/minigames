import './style.scss';
import './pages/home/home-page';
import { homePage } from './pages/home/home-page';

const startApp = () => {
  const body = document.querySelector('#app');
  body?.append(homePage());
};

startApp();
