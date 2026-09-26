import './leaderboard.scss';
import { createHTMLElement } from '../../helpers/dom';
import { heading } from '../heading/heading';

const data = [
  {
    rank: 1,
    playerName: 'Alex_Pro99',
    gamesPlayed: 142,
    totalScore: 94_250,
    streakDays: 12,
    favoriteGameSlug: 'heartopia',
    favoriteGameName: 'Heartopia',
  },
  {
    rank: 2,
    playerName: 'CozyGamer_x',
    gamesPlayed: 118,
    totalScore: 81_400,
    streakDays: 8,
    favoriteGameSlug: 'cat-mail-co',
    favoriteGameName: 'Cat Mail Co.',
  },
  {
    rank: 3,
    playerName: 'MatchMaster',
    gamesPlayed: 98,
    totalScore: 72_110,
    streakDays: 5,
    favoriteGameSlug: 'tiny-glade',
    favoriteGameName: 'Tiny Glade',
  },
  {
    rank: 4,
    playerName: 'BubblePop',
    gamesPlayed: 87,
    totalScore: 65_900,
    streakDays: 3,
    favoriteGameSlug: 'whisper-of-the-house',
    favoriteGameName: 'Whisper of the House',
  },
  {
    rank: 5,
    playerName: 'SudokuGod',
    gamesPlayed: 74,
    totalScore: 59_320,
    streakDays: 2,
    favoriteGameSlug: 'cat-chess',
    favoriteGameName: 'Cat Chess',
  },
];

//TODO needs refactoring
export const leaderboard = (): HTMLElement => {
  const wrapper = createHTMLElement({ tag: 'div', classList: 'wrapper' });
  const leaderboard = createHTMLElement({ tag: 'section' });
  const headingElement = heading('Top players this week');

  const table = createHTMLElement({ tag: 'table', classList: 'table' });
  const thead = createHTMLElement({ tag: 'thead', classList: 'table_head' });
  const headRow = createHTMLElement({ tag: 'tr' });
  thead.append(headRow);
  const rows = [
    'Rank',
    'Player',
    'Games',
    'Total score',
    'Streak',
    'Favorite game',
  ];

  for (const rowName of rows) {
    const element = createHTMLElement({ tag: 'th', textContent: rowName });
    if (rowName === 'Favorite game') element.dataset.row = 'favgames';
    else if (rowName === 'Games') element.dataset.row = 'games';
    headRow.append(element);
  }

  const tbody = createHTMLElement({ tag: 'tbody' });

  for (const playerInfo of data) {
    const row = createHTMLElement({ tag: 'tr', classList: 'table_row' });

    const rankString = '#' + playerInfo.rank;
    const rank = createHTMLElement({ tag: 'td', textContent: rankString });
    row.append(rank);

    const player = createHTMLElement({
      tag: 'td',
      textContent: playerInfo.playerName,
    });
    row.append(player);

    const gamesString = playerInfo.gamesPlayed.toString();
    const gamesPlayed = createHTMLElement({
      tag: 'td',
      textContent: gamesString,
      attributes: [['data-row', 'games']],
    });
    row.append(gamesPlayed);

    const scoreString = playerInfo.totalScore.toLocaleString();
    const score = createHTMLElement({ tag: 'td', textContent: scoreString });
    row.append(score);

    const streakString = '🔥 ' + playerInfo.streakDays;
    const streak = createHTMLElement({
      tag: 'td',
      textContent: streakString,
      classList: 'info_streak',
    });
    row.append(streak);

    const fav = createHTMLElement({
      tag: 'td',
      textContent: playerInfo.favoriteGameName,
      attributes: [['data-row', 'favgames']],
    });
    row.append(fav);

    tbody.append(row);
  }

  table.append(thead, tbody);

  leaderboard.append(headingElement, table);
  wrapper.append(leaderboard);
  return wrapper;
};
