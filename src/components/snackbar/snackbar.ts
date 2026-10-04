import { createHTMLElement } from '../../helpers/dom';
import './snackbar.scss';

type SnackbarMode = 'success' | 'error';

export const snackbarContainer = createHTMLElement({
  tag: 'div',
  classList: 'snackbars',
  attributes: [['popover', 'manual']],
});

export const snackbar = (type: SnackbarMode, message: string): void => {
  const snackbar = createHTMLElement({
    tag: 'div',
    classList: 'snackbar',
  });
  if (type === 'error') snackbar.classList.add('snackbar--error');
  else if (type === 'success') snackbar.classList.add('snackbar--success');
  const text = createHTMLElement({
    tag: 'span',
    classList: 'snackbar_message',
    textContent: message,
  });
  const closeButton = createHTMLElement({
    tag: 'button',
    textContent: 'X',
    attributes: [['type', 'button']],
  });
  snackbar.append(text, closeButton);
  const remove = () => snackbar.remove();
  closeButton.addEventListener('click', remove);
  setTimeout(remove, 5000); // TODO animate and design snackbar
  snackbarContainer.append(snackbar);
};
