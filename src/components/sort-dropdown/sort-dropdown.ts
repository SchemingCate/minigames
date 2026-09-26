import './sort-dropdown.scss';
import { createHTMLElement } from '../../helpers/dom';

export const sortDropdown = (): HTMLElement => {
  const sort = createHTMLElement({ tag: 'div', textContent: 'Sort by' });
  return sort;
};
