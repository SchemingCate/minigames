import './header.scss';
import { logo } from '../logo/logo';
import { menu } from './menu/menu';

export const header: () => Node = () => {
  const headerElement = document.createElement('header');
  headerElement.classList = 'header';
  headerElement.append(logo(), menu());
  return headerElement;
};
