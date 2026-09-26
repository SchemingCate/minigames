import './sort-dropdown.scss';
import { createHTMLElement } from '../../helpers/dom';

const sortOptions = [
  {
    slug: 'rating-highest',
    label: 'Rating ↑',
    isActive: true,
  },
  {
    slug: 'rating-lowest',
    label: 'Rating ↓',
    isActive: false,
  },
  {
    slug: 'rating-a-z',
    label: 'Name A→Z',
    isActive: false,
  },
  {
    slug: 'rating-z-a',
    label: 'Name Z→A',
    isActive: false,
  },
];

export const sortDropdown = (): HTMLElement => {
  const sort = createHTMLElement({ tag: 'div', classList: 'sort' });
  const sortButton = createHTMLElement({
    tag: 'button',
    classList: 'sort_button',
    textContent: 'Sort by: Rating ↑',
    attributes: [
      ['id', 'sort-button'],
      ['type', 'button'],
      ['aria-haspopup', 'listbox'],
      ['aria-expanded', 'false'],
    ],
  });

  const sortList = createHTMLElement({
    tag: 'ul',
    classList: 'sort_list',
    attributes: [
      ['role', 'listbox'],
      ['aria-labelledby', 'sort-button'],
      ['hidden', ''],
    ],
  });

  let selectedId = 'rating-highest';
  for (const { slug, label, isActive } of sortOptions) {
    const optionElement = createHTMLElement({
      tag: 'li',
      textContent: label,
      classList: 'sort_list_item',
      attributes: [
        ['id', slug],
        ['role', 'option'],
        ['aria-selected', isActive.toString()],
      ],
    });
    sortList.append(optionElement);
  }

  sort.append(sortButton, sortList);

  sort.addEventListener('click', (event) => {
    const target =
      (event.target as HTMLElement).closest('.sort_button') ||
      (event.target as HTMLElement).closest('.sort_list_item');
    if (!target) return;
    const isAriaExpandedNew =
      sortButton.getAttribute('aria-expanded') !== 'true';
    sortButton.setAttribute('aria-expanded', isAriaExpandedNew.toString());
    sortList.toggleAttribute('hidden');

    if (!target.classList.contains('sort_list_item')) return;
    const previous = sort.querySelector(`#${selectedId}`);
    previous?.setAttribute('aria-selected', 'false');
    selectedId = target.id;
    target.setAttribute('aria-selected', 'true');
    sortButton.textContent = `Sort by: ${target.textContent}`;
  });

  return sort;
};
