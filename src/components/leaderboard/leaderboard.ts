import './leaderboard.scss';
import { createHTMLElement } from '../../helpers/dom';

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

export const leaderboard = (): HTMLElement => {
  const leaderboard = createHTMLElement({ tag: 'section' });
  const heading = createHTMLElement({
    tag: 'h2',
    textContent: 'Top players this week',
  });

  const table = createHTMLElement({ tag: 'table' });
  const thead = createHTMLElement({ tag: 'thead' });
  const headRow = createHTMLElement({ tag: 'tr' });
  thead.append(headRow);
  const rows = [
    'Rank',
    'Player',
    'Games played',
    'Total score',
    'Streak',
    'Favorite game',
  ];

  for (const rowName of rows) {
    const element = createHTMLElement({ tag: 'th', textContent: rowName });
    headRow.append(element);
  }

  const tbody = createHTMLElement({ tag: 'tbody' });

  for (const playerInfo of data) {
    const row = createHTMLElement({ tag: 'tr' });

    const rankString = playerInfo.rank.toString();
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
    });
    row.append(gamesPlayed);

    const scoreString = playerInfo.totalScore.toString();
    const score = createHTMLElement({ tag: 'td', textContent: scoreString });
    row.append(score);

    const streakString = playerInfo.streakDays.toString();
    const streak = createHTMLElement({ tag: 'td', textContent: streakString });
    row.append(streak);

    const fav = createHTMLElement({
      tag: 'td',
      textContent: playerInfo.favoriteGameName,
    });
    row.append(fav);

    tbody.append(row);
  }

  table.append(thead, tbody);

  leaderboard.append(heading, table);
  return leaderboard;
};
