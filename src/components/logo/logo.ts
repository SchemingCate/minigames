import './logo.scss';
import logoSvg from '../../assets/logos/logo.svg';

export const logo: () => Node = () => {
  const logoElement = document.createElement('div');
  logoElement.classList = 'logo';
  const logoImg = document.createElement('img');
  logoImg.src = logoSvg;
  logoImg.alt = 'MiniGames logo';
  const title = document.createElement('h1');
  title.textContent = 'MiniGames';
  title.classList = 'logo_title';
  logoElement.append(logoImg, title);
  return logoElement;
};
