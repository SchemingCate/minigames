import './menu.scss';
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
  const nav = createHTMLElement({ tag: 'nav' });

  const navList = createHTMLElement({ tag: 'ul', classList: 'nav_list' });

  for (const [title, link] of menuLinks) {
    const listElement = createHTMLElement({ tag: 'li' });

    const linkElement = createHTMLElement({
      tag: 'a',
      textContent: title,
      attributes: [['href', link]],
    });

    listElement.append(linkElement);
    navList.append(listElement);
  }

  nav.append(navList);

  const buttonContainer = createHTMLElement({
    tag: 'div',
    classList: 'buttons',
  });
  buttonContainer.append(button('Log in'), button('Sign up'));
  menu.append(nav, buttonContainer);

  return menu;
};
