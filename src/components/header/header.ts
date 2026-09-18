import { logo } from '../logo/logo';

export const header: () => Node = () => {
  const headerElement = document.createElement('header');
  headerElement.append(logo());
  return headerElement;
};
