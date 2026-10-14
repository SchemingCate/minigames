if (typeof CSS === 'undefined' || typeof CSS.escape !== 'function') {
  Object.defineProperty(globalThis, 'CSS', {
    configurable: true,
    writable: true,
    value: {
      escape: (value: string) =>
        value.replaceAll(/[^\w-]/g, (character) => `\\${character}`),
    },
  });
}
