import { header } from '../../components/header/header';
import { hero } from '../../components/hero/hero';
import { leaderboard } from '../../components/leaderboard/leaderboard';
import { footer } from '../../components/footer/footer';

export const homePage: () => Node = () => {
  const page = document.createElement('div');
  page.append(header('home'), hero(), leaderboard(), footer());
  return page;
};
