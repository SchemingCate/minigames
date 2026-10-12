import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('./pages/home/home-page', () => ({
  homePage: () =>
    Object.assign(document.createElement('main'), { id: 'home-page' }),
}));
vi.mock('./pages/library/library', () => ({
  libraryPage: () =>
    Object.assign(document.createElement('main'), { id: 'library-page' }),
}));
vi.mock('./components/shared/modal/modal', () => ({
  modal: () => Object.assign(document.createElement('div'), { id: 'modal' }),
}));

import { startApp } from './app';

const addLink = (root: HTMLElement, page: string) => {
  const link = document.createElement('a');
  link.dataset.page = page;
  link.href = '#';
  root.append(link);
  return link;
};

describe('startApp', () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    root = document.querySelector<HTMLElement>('#app')!;
  });

  it('renders the home page and modal on start', () => {
    startApp(root);
    expect(root.querySelector('#home-page')).not.toBeNull();
    expect(root.querySelector('#modal')).not.toBeNull();
  });

  it('switches to the library page when a library link is clicked', () => {
    startApp(root);
    addLink(root, 'library').click();

    expect(root.querySelector('#library-page')).not.toBeNull();
    expect(root.querySelector('#home-page')).toBeNull();
  });

  it('replaces content instead of stacking pages and modals', () => {
    startApp(root);
    addLink(root, 'library').click();
    root.querySelector<HTMLAnchorElement>('a[data-page]'); // link was removed by render
    expect(root.children).toHaveLength(2); // page + modal
  });

  it('prevents default link navigation', () => {
    startApp(root);
    const link = addLink(root, 'library');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores unknown page names', () => {
    startApp(root);
    addLink(root, 'settings').click();
    expect(root.querySelector('#home-page')).not.toBeNull();
  });

  it('ignores clicks outside links', () => {
    startApp(root);
    root.click();
    expect(root.querySelector('#home-page')).not.toBeNull();
  });

  it('does nothing when the root element is missing', () => {
    document.body.replaceChildren();
    expect(() => startApp()).not.toThrow();
  });
});
