import './input.scss';

import { createHTMLElement } from '../../../helpers/dom';

interface FieldElementObject {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  autocomplete?: AutoFill;
  pattern?: string;
}

export const createField = ({
  id,
  name,
  type,
  label,
  placeholder,
  required,
  minLength,
  autocomplete,
  pattern,
}: FieldElementObject): HTMLElement => {
  const element = createHTMLElement({ tag: 'div', classList: 'field' });
  const labelElement = createHTMLElement({
    tag: 'label',
    classList: 'field_label',
    textContent: label,
    attributes: [['for', id]],
  });

  const inputContainer = createHTMLElement({
    tag: 'div',
    classList: 'field_input-container',
  });
  const inputElement = createHTMLElement({
    tag: 'input',
    classList: 'field_input-container_input',
    attributes: [
      ['type', type],
      ['name', name],
      ['id', id],
      ['placeholder', placeholder],
    ],
  });
  const errorElement = createHTMLElement({
    tag: 'span',
    classList: 'field_input-container_error',
    attributes: [['data-error-for', name]],
  });

  inputContainer.append(inputElement, errorElement);

  if (required) inputElement.required = true;
  if (minLength) inputElement.minLength = minLength;
  if (autocomplete) inputElement.autocomplete = autocomplete;
  if (pattern) inputElement.pattern = pattern;

  element.append(labelElement, inputContainer);
  return element;
};
