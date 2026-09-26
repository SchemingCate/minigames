import { header } from '../../components/header/header';
import { footer } from '../../components/footer/footer';

export const libraryPage = (): HTMLElement => {
  const page = document.createElement('div');
  page.append(header('library'), footer());
  return page;
};
