export const button: (text: string) => Node = (text) => {
  const buttonElement = document.createElement('button');
  buttonElement.textContent = text;
  return buttonElement;
};
