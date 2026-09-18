export const logo: () => Node = () => {
  const logoElement = document.createElement('div');
  const title = document.createElement('h1');
  title.textContent = 'MiniGames';
  logoElement.append(title);
  return logoElement;
};
