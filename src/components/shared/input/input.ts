import './input.scss';

import { createHTMLElement } from '../../../helpers/dom';

interface FieldElementObject {
  id: string;
  type: string;
  label: string;
  placeholder: string;
}

export const createField = ({
  id,
  type,
  label,
  placeholder,
}: FieldElementObject): HTMLElement => {
  const element = createHTMLElement({ tag: 'div', classList: 'field' });
  const labelElement = createHTMLElement({
    tag: 'label',
    classList: 'field_label',
    textContent: label,
    attributes: [['for', id]],
  });
  const inputElement = createHTMLElement({
    tag: 'input',
    classList: 'field_input',
    attributes: [
      ['type', type],
      ['id', id],
      ['placeholder', placeholder],
    ],
  });

  element.append(labelElement, inputElement);
  return element;
};
