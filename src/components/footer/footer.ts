import './footer.scss';
import { createHTMLElement } from '../../helpers/dom';
import { logo } from '../logo/logo';
import type { PageId } from '../../helpers/types';

const exploreLinks: [string, string, PageId][] = [
  ['home', '#', 'home'],
  ['library', '#', 'library'],
  ['categories', '#', 'home'],
  ['tournaments', '#', 'home'],
];

const companyLinks: [string, string, PageId][] = [
  ['about us', '#', 'home'],
  ['contact', '#', 'home'],
  ['privacy policy', '#', 'home'],
  ['terms of service', '#', 'home'],
];

const communityLinks: [string, string, PageId][] = [
  ['share', '#', 'home'],
  ['messages', '#', 'home'],
  ['rss', '#', 'home'],
];

export const footer = (): HTMLElement => {
  const footer = createHTMLElement({ tag: 'footer', classList: 'footer' });

  const topFooterElement = createHTMLElement({
    tag: 'div',
    classList: 'footer_top',
  });

  const game = createHTMLElement({ tag: 'div' });
  const description = createHTMLElement({
    tag: 'p',
    textContent:
      'Take a short break and have fun. Hundreds of curated casual mini-games right in your web browser. No download required.',
  });
  game.append(logo(), description);

  const linksContainer = createHTMLElement({ tag: 'div' });

  const linksContent: [string, [string, string, PageId][]][] = [
    ['explore', exploreLinks],
    ['company', companyLinks],
    ['community', communityLinks],
  ];

  for (const [headingText, links] of linksContent) {
    const linkCategory = createHTMLElement({ tag: 'div' });
    const heading = createHTMLElement({ tag: 'h3', textContent: headingText });

    const linkList = createHTMLElement({ tag: 'ul' });

    for (const [title, link, id] of links) {
      const listElement = createHTMLElement({ tag: 'li' });

      const a = createHTMLElement({
        tag: 'a',
        classList: 'nav_link',
        textContent: title,
        attributes: [
          ['href', link],
          ['data-page', id],
        ],
      });
      listElement.append(a);
      linkList.append(listElement);
    }

    linkCategory.append(heading, linkList);
    linksContainer.append(linkCategory);
  }

  topFooterElement.append(game, linksContainer);

  const bottomFooterElement = createHTMLElement({
    tag: 'div',
    classList: 'footer_bottom',
  });
  const copyright = createHTMLElement({
    tag: 'span',
    textContent: '© 2026 MiniGames. All rights reserved.',
  });
  const rsLink = createHTMLElement({ tag: 'a', textContent: 'RS School' });
  const studentLink = createHTMLElement({
    tag: 'a',
    textContent: '@SchemingCate',
  });
  const design = createHTMLElement({
    tag: 'span',
    textContent: 'Designed with love',
  });

  bottomFooterElement.append(copyright, rsLink, studentLink, design);

  footer.append(topFooterElement, bottomFooterElement);
  return footer;
};
