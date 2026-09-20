import './hero.scss';
import { createHTMLElement } from '../../helpers/dom';

export const hero = (): HTMLElement => {
  const heroSection = createHTMLElement({ tag: 'section', classList: 'hero' });
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
  heroSection.append(heroTitle, heroParagraph);
  return heroSection;
};
