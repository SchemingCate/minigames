interface HTMLElementObject<K extends keyof HTMLElementTagNameMap> {
  tag: K;
  classList?: string;
  textContent?: string;
  attributes?: [string, string][];
}

export const createHTMLElement = <K extends keyof HTMLElementTagNameMap>({
  tag,
  attributes = [],
  classList,
  textContent,
}: HTMLElementObject<K>): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  if (textContent) {
    element.textContent = textContent;
  }
  if (classList) {
    element.classList = classList;
  }
  if (attributes) {
    for (const [name, value] of attributes) {
      element.setAttribute(name, value);
    }
  }
  return element;
};
