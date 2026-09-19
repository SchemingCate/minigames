import { logo } from '../logo/logo';
import { button } from '../button/button';

export const header: () => Node = () => {
  const headerElement = document.createElement('header');
  const nav = document.createElement('nav');
  const navList = document.createElement('ul');
  nav.append(navList);

  for (const element of ['home', 'library', 'tournaments', 'community']) {
    const listItem = document.createElement('li');
    listItem.textContent = element;
    navList.append(listItem);
  }

  headerElement.append(logo(), nav, button('Log in'), button('Sign up'));
  return headerElement;
};
