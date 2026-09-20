import './logo.scss';
import logoSvg from '../../assets/logos/logo.svg';
import { createHTMLElement } from '../../helpers/dom';

export const logo = (): HTMLElement => {
  const logoElement = createHTMLElement({ tag: 'div', classList: 'logo' });

  const logoImg = createHTMLElement({
    tag: 'img',
    attributes: [
      ['src', logoSvg],
      ['alt', 'MiniGames logo'],
    ],
  });

  const title = createHTMLElement({
    tag: 'h1',
    textContent: 'MiniGames',
    classList: 'logo_title',
  });

  logoElement.append(logoImg, title);

  return logoElement;
};
