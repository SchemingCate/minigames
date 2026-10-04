import { createHTMLElement } from '../../helpers/dom';
import './records-table.scss';
import type { Record } from '../../helpers/interfaces';
import { getTimeAgoString } from '../../helpers/get-time-age-string';

const placeRewardMap = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

const records = createHTMLElement({
  tag: 'ol',
  classList: 'records records--loading',
});

export const recordsTablePlaceholder = (): HTMLElement => {
  //TODO : add dynamic time
  for (const placeNumber in placeRewardMap) {
    records.append(createRecordItem(Number(placeNumber)));
  }

  return records;
};

const createRecordItem = (place: number, record?: Record): HTMLElement => {
  const item = createHTMLElement({ tag: 'li', classList: 'records_item' });
  const placeElement = createHTMLElement({
    tag: 'span',
    textContent: place.toString(),
    classList: 'records_item_place',
  });
  const name = createHTMLElement({
    tag: 'span',
    classList: 'records_item_name',
  });
  const points = createHTMLElement({
    tag: 'span',
    classList: 'records_item_points',
  });
  const time = createHTMLElement({
    tag: 'span',
    classList: 'records_item_time',
  });

  if (record) {
    name.textContent = record.playerName;
    points.textContent = record.score.toString();
    time.textContent = getTimeAgoString(record.achievedAt);
  }
  item.append(placeElement, name, points, time);
  return item;
};

export const fillRecordsTable = (recordsData: Record[]): void => {
  records.classList.remove('records--loading');
  records.replaceChildren(
    ...recordsData.map((record, index) => createRecordItem(index + 1, record)),
  );
};
