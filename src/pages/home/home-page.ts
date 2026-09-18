import { header } from '../../components/header/header';

export const homePage: () => Node = () => {
  const page = document.createElement('div');
  page.append(header());
  return page;
};
