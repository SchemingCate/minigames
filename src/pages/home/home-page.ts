import { header } from '../../components/header/header';
import { hero } from '../../components/hero/hero';
import { leaderboard } from '../../components/leaderboard/leaderboard';

export const homePage: () => Node = () => {
  const page = document.createElement('div');
  page.append(header('home'), hero(), leaderboard());
  return page;
};
