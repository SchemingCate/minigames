import './library.scss';
import { header } from '../../components/header/header';
import { footer } from '../../components/footer/footer';
import { createHTMLElement } from '../../helpers/dom';

export const libraryPage = (): HTMLElement => {
  const page = createHTMLElement({ tag: 'div' });
  const pageContent = createHTMLElement({ tag: 'main', classList: 'library' });
  const pageTitle = createHTMLElement({
    tag: 'div',
    classList: 'library_page-title',
  });
  const pageTitleHeading = createHTMLElement({
    tag: 'h1',
    textContent: 'Game Library',
    classList: 'library_page-title_heading',
  });
  const pageTitleDescription = createHTMLElement({
    tag: 'p',
    textContent: 'Browse our collection of casual mini-games',
    classList: 'library_page-title_paragraph',
  });
  pageTitle.append(pageTitleHeading, pageTitleDescription);
  pageContent.append(pageTitle);
  page.append(header('library'), pageContent, footer());
  return page;
};
