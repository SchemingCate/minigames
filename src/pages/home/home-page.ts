import { header } from '../../components/header/header';
import { hero } from '../../components/hero/hero';

export const homePage: () => Node = () => {
  const page = document.createElement('div');
  page.append(header(), hero());
  return page;
};
