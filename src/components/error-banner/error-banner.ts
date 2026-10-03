import './error-banner.scss';
import { createHTMLElement } from '../../helpers/dom';

export const errorBanner = (error: unknown, retry: () => void): HTMLElement => {
  const banner = createHTMLElement({
    tag: 'div',
    classList: 'error',
  });
  const title = createHTMLElement({
    tag: 'h2',
    textContent: 'Oops!',
    classList: 'error_title',
  });
  const text = createHTMLElement({
    tag: 'p',
    textContent: 'Something went very wrong :(',
    classList: 'error_text',
  });
  const errorMessage = createHTMLElement({
    tag: 'p',
    classList: 'error_message',
  });
  if (error instanceof Error) {
    errorMessage.textContent = error.message;
  }
  const button = createHTMLElement({
    tag: 'button',
    textContent: 'Retry',
    classList: 'error_button',
  });
  button.addEventListener('click', retry);
  banner.append(title, text, errorMessage, button);
  return banner;
};
