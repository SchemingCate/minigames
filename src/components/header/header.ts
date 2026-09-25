import './header.scss';
import { logo } from '../logo/logo';
import { menu } from './menu/menu';
import { createHTMLElement } from '../../helpers/dom';

export const header: () => Node = () => {
  const headerElement = createHTMLElement({
    tag: 'header',
    classList: 'header',
  });
  const container = createHTMLElement({
    tag: 'div',
    classList: 'header_container',
  });
  container.append(logo(), menu());
  headerElement.append(container);
  return headerElement;
};
