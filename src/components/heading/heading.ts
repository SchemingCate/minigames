import './heading.scss';
import { createHTMLElement } from '../../helpers/dom';

export const heading = (text: string): HTMLElement => {
  const heading = createHTMLElement({
    tag: 'h2',
    classList: 'heading',
    textContent: text,
  });
  return heading;
};
