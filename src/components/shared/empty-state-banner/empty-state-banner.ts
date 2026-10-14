import { createHTMLElement } from '../../../helpers/dom';
import './empty-state-banner.scss';

export const emptyStateBanner = (): HTMLElement => {
  const banner = createHTMLElement({ tag: 'div', classList: 'empty' });
  const title = createHTMLElement({
    tag: 'h2',
    textContent: 'No items :(',
    classList: 'empty_title',
  });
  const text = createHTMLElement({
    tag: 'p',
    textContent: 'No games found.',
    classList: 'empty_text',
  });
  banner.append(title, text);

  return banner;
};
