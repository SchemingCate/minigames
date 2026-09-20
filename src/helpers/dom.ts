type HTMLElementObject = {
  tag: string;
  classList?: string;
  textContent?: string;
  attributes?: [string, string][];
};

export const createHTMLElement = (
  HTMLElement: HTMLElementObject,
): HTMLElement => {
  const element = document.createElement(HTMLElement.tag);
  if (HTMLElement.textContent) {
    element.textContent = HTMLElement.textContent;
  }
  if (HTMLElement.classList) {
    element.classList = HTMLElement.classList;
  }
  if (HTMLElement.attributes) {
    for (const [name, value] of HTMLElement.attributes) {
      element.setAttribute(name, value);
    }
  }

  return element;
};
