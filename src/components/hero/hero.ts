import './hero.scss';
import { createHTMLElement } from '../../helpers/dom';
import { ButtonType } from '../../helpers/enums';
import { button } from '../button/button';

export const hero = (): HTMLElement => {
  const hero = createHTMLElement({ tag: 'div', classList: 'hero' });
  const heroContainer = createHTMLElement({
    tag: 'div',
    classList: 'hero_container',
  });
  const heroContent = createHTMLElement({
    tag: 'section',
    classList: 'hero_content',
  });
  const heroTitle = createHTMLElement({
    tag: 'h2',
    textContent: 'Take a Short Break & Have Fun',
    classList: 'hero_heading',
  });
  const heroParagraph = createHTMLElement({
    tag: 'p',
    classList: 'hero_paragraph',
    textContent:
      'Discover hundreds of curated casual mini-games. Play instantly in your browser — puzzle, match 3, farm, and board classics.',
  });
  heroContent.append(heroTitle, heroParagraph, button(ButtonType.Library));
  heroContainer.append(heroContent);
  hero.append(heroContainer);
  return hero;
};
