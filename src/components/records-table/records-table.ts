import { createHTMLElement } from '../../helpers/dom';
import './records-table.scss';
import type { record } from '../../helpers/interfaces';

const placeRewardMap = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export const recordsTable = (recordsData: record[]): HTMLElement => {
  const records = createHTMLElement({ tag: 'ol', classList: 'records' });

  //TODO : add dynamic time
  for (const { position, playerName, score } of recordsData) {
    const item = createHTMLElement({ tag: 'li', classList: 'records_item' });
    const place = createHTMLElement({
      tag: 'span',
      textContent: placeRewardMap[position],
      classList: 'records_item_place',
    });
    const name = createHTMLElement({
      tag: 'span',
      textContent: playerName,
      classList: 'records_item_name',
    });
    const points = createHTMLElement({
      tag: 'span',
      textContent: score.toString(),
      classList: 'records_item_points',
    });
    const time = createHTMLElement({
      tag: 'span',
      textContent: '2 days ago',
      classList: 'records_item_time',
    });
    item.append(place, name, points, time);
    records.append(item);
  }

  return records;
};
