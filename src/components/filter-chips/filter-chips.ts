import './filter-chips.scss';
import { createHTMLElement } from '../../helpers/dom';
import { fetchCategories } from '../../api/fetch-categories';
import { snackbar } from '../snackbar/snackbar';
import type { GameCategory } from '../../helpers/types';
import type { LoadGames } from '../../pages/library/library';
import { updateCategory } from '../../api/fetch-games/fetch-games-parameters';

const chips = createHTMLElement({
  tag: 'div',
  classList: 'chips',
  attributes: [
    ['role', 'radiogroup'],
    ['aria-label', 'filter by game type'],
  ],
});

const loadCategories = async (messageContainer: HTMLElement): Promise<void> => {
  try {
    const data = await fetchCategories();
    const categories = data.data;
    for (const { slug, label, isDefault } of categories) {
      const chip = createHTMLElement({
        tag: 'button',
        classList: 'chips_item',
        textContent: label,
        attributes: [
          ['type', 'button'],
          ['role', 'radio'],
          ['aria-checked', isDefault.toString()],
          ['data-category', slug],
        ],
      });
      if (isDefault) chip.classList.add('chips_item--active');
      chips.append(chip);
    }
    messageContainer.append(snackbar('success', 'Success: Categories loaded'));
  } catch {
    messageContainer.append(
      snackbar('error', 'Error: failed to load categories'),
    );
  }
};

export const filterChips = (
  messageContainer: HTMLElement,
  updateUI: LoadGames,
): HTMLElement => {
  chips.addEventListener('click', (event) => {
    //TODO fix delay when hover is active
    const pressedChip = (event.target as HTMLElement).closest(
      '.chips_item',
    ) as HTMLElement;
    if (!pressedChip) return;
    const allChips = chips.querySelectorAll('.chips_item');
    for (const chipButton of allChips) {
      const isPressedChip = chipButton === pressedChip;
      chipButton.classList.toggle('chips_item--active', isPressedChip);
      chipButton.setAttribute('aria-checked', isPressedChip.toString());
    }

    const category = pressedChip.dataset.category as GameCategory;
    updateCategory(category);

    void updateUI();
  });

  void loadCategories(messageContainer);

  return chips;
};
