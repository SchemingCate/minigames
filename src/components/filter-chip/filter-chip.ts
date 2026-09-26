import './filter-chip.scss';
import { createHTMLElement } from '../../helpers/dom';

export const filterChip = (text: string): HTMLElement => {
  const chip = createHTMLElement({
    tag: 'button',
    classList: 'chip',
    textContent: text,
  });
  return chip;
};
