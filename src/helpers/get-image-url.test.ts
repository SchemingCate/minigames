import { describe, it, expect } from 'vitest';
import { getImageUrl } from './get-image-url';

const realImages = import.meta.glob<string>(
  '../assets/images/**/*.{jpg,png,jpeg,webp}',
  { eager: true, import: 'default' },
);

const PREFIX = '../assets/images/';
const entries = Object.entries(realImages).map(([key, url]) => ({
  relativePath: key.replace(PREFIX, ''),
  url,
}));

describe('getImageUrl', () => {
  it('has real images to test against', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it('resolves every existing image from its API path', () => {
    for (const { relativePath, url } of entries) {
      expect(getImageUrl(`/assets/images/${relativePath}`)).toBe(url);
    }
  });

  it('also accepts a path without the /assets/images/ prefix', () => {
    const [{ relativePath, url }] = entries;

    expect(getImageUrl(relativePath)).toBe(url);
  });

  it('returns a non-empty string', () => {
    const [{ relativePath }] = entries;

    const result = getImageUrl(`/assets/images/${relativePath}`);

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  describe('when the image does not exist', () => {
    it('throws an error that names the requested path', () => {
      expect(() => getImageUrl('/assets/images/does-not-exist.png')).toThrow(
        'Image not found: /assets/images/does-not-exist.png',
      );
    });

    it('throws for an empty path', () => {
      expect(() => getImageUrl('')).toThrow('Image not found: ');
    });

    it('throws for an unsupported file extension', () => {
      const [{ relativePath }] = entries;
      const withoutExtension = relativePath.replace(/\.[^.]+$/, '');

      expect(() =>
        getImageUrl(`/assets/images/${withoutExtension}.gif`),
      ).toThrow(/Image not found/);
    });

    it('only strips the prefix at the start of the path', () => {
      const [{ relativePath }] = entries;

      expect(() => getImageUrl(`/other/assets/images/${relativePath}`)).toThrow(
        /Image not found/,
      );
    });

    it('does not resolve paths that climb out of the images folder', () => {
      expect(() => getImageUrl('/assets/images/../../package.json')).toThrow(
        /Image not found/,
      );
    });
  });
});
