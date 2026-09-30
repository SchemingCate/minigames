const images = import.meta.glob<string>(
  '../assets/images/**/*.{jpg,png,jpeg,webp}',
  {
    eager: true,
    import: 'default',
  },
);

export const getImageUrl = (apiPath: string): string => {
  const relativePath = apiPath.replace(/^\/assets\/images\//, '');
  const key = `../assets/images/${relativePath}`;

  const url = images[key];
  if (!url) throw new Error(`Image not found: ${apiPath}`);
  return url;
};
