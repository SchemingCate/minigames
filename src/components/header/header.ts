import './header.scss';
import { logo } from '../logo/logo';
import { menu } from './menu/menu';
import { createHTMLElement } from '../../helpers/dom';
import type { PageId } from '../../helpers/types';

export const header = (page: PageId): Node => {
  const headerElement = createHTMLElement({
    tag: 'header',
    classList: 'header',
  });
  const container = createHTMLElement({
    tag: 'div',
    classList: 'header_container',
  });

  container.append(logo(), menu(page));
  headerElement.append(container);
  return headerElement;
};
