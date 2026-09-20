import './menu.scss';
import { ButtonType } from '../../../helpers/enums';
import { button } from '../../button/button';
import { createHTMLElement } from '../../../helpers/dom';

const menuLinks: [string, string][] = [
  ['home', '#'],
  ['library', '#'],
  ['tournaments', '#'],
  ['community', '#'],
];

export const menu = (): HTMLElement => {
  const menu = createHTMLElement({ tag: 'div', classList: 'menu' });
  const nav = createHTMLElement({ tag: 'nav', classList: 'nav' });

  const navList = createHTMLElement({ tag: 'ul', classList: 'nav_list' });

  const currentPage = 'home';

  for (const [title, link] of menuLinks) {
    const listElement = createHTMLElement({ tag: 'li' });

    const linkElement = createHTMLElement({
      tag: 'a',
      classList: 'nav_link',
      textContent: title,
      attributes: [['href', link]],
    });

    if (title === currentPage) linkElement.classList.add('nav_link--current');

    listElement.append(linkElement);
    navList.append(listElement);
  }

  nav.append(navList);

  const buttonContainer = createHTMLElement({
    tag: 'div',
    classList: 'buttons',
  });
  buttonContainer.append(button(ButtonType.LogIn), button(ButtonType.SignUp));
  menu.append(nav, buttonContainer);

  return menu;
};
