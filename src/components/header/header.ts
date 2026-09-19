import './header.scss';
import { logo } from '../logo/logo';
import { button } from '../button/button';

export const header: () => Node = () => {
  const headerElement = document.createElement('header');
  headerElement.classList = 'header';
  const headerLinks = document.createElement('div');
  headerLinks.classList = 'header_links';
  const nav = document.createElement('nav');
  const navList = document.createElement('ul');
  navList.classList = 'nav_list';
  headerLinks.append(nav, button('Log in'), button('Sign up'));
  nav.append(navList);

  for (const element of ['home', 'library', 'tournaments', 'community']) {
    const listItem = document.createElement('li');
    listItem.textContent = element;
    navList.append(listItem);
  }

  headerElement.append(logo(), headerLinks);
  return headerElement;
};
