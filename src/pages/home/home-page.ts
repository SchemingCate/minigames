import { header } from '../../components/shared/header/header';
import { hero } from '../../components/for-home-page/hero/hero';
import { leaderboard } from '../../components/for-home-page/leaderboard/leaderboard';
import { footer } from '../../components/shared/footer/footer';

export const homePage: () => Node = () => {
  const page = document.createElement('div');
  page.append(header('home'), hero(), leaderboard(), footer());
  return page;
};
