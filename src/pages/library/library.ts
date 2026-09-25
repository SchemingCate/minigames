import { header } from '../../components/header/header';

export const libraryPage = (): HTMLElement => {
  const page = document.createElement('div');
  page.append(header('library'));
  return page;
};
