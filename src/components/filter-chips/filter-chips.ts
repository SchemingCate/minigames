import './filter-chips.scss';
import { createHTMLElement } from '../../helpers/dom';

interface chipData {
  slug: string;
  label: string;
  isDefault: boolean;
}

const chipsData: chipData[] = [
  {
    slug: 'all',
    label: 'All Games',
    isDefault: true,
  },
  {
    slug: 'puzzle',
    label: 'Puzzle',
    isDefault: false,
  },
  {
    slug: 'card',
    label: 'Card',
    isDefault: false,
  },
  {
    slug: 'match',
    label: 'Match',
    isDefault: false,
  },
  {
    slug: 'farm',
    label: 'Farm',
    isDefault: false,
  },
  {
    slug: 'strategy',
    label: 'Strategy',
    isDefault: false,
  },
  {
    slug: 'arcade',
    label: 'Arcade',
    isDefault: false,
  },
];

export const filterChips = (): HTMLElement => {
  const chips = createHTMLElement({
    tag: 'div',
    classList: 'chips',
    attributes: [
      ['role', 'radiogroup'],
      ['aria-label', 'filter by game type'],
    ],
  });

  for (const { label, isDefault } of chipsData) {
    const chip = createHTMLElement({
      tag: 'button',
      classList: 'chips_item',
      textContent: label,
      attributes: [
        ['type', 'button'],
        ['role', 'radio'],
        ['aria-checked', isDefault.toString()],
      ],
    });
    if (isDefault) chip.classList.add('chips_item--active');
    chips.append(chip);
  }

  chips.addEventListener('click', (event) => {
    //TODO fix delay when hover is active
    const pressedChip = (event.target as HTMLElement).closest('.chips_item');
    if (!pressedChip) return;
    const allChips = chips.querySelectorAll('.chips_item');
    for (const chipButton of allChips) {
      const isPressedChip = chipButton === pressedChip;
      chipButton.classList.toggle('chips_item--active', isPressedChip);
      chipButton.setAttribute('aria-checked', isPressedChip.toString());
    }
  });

  return chips;
};
