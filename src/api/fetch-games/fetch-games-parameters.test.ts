import { beforeEach, describe, expect, it, vi } from 'vitest';

const load = async () => import('./fetch-games-parameters');

describe('fetch games parameters', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('starts with the default library query', async () => {
    const { parameters } = await load();

    expect(parameters).toEqual({
      featured: false,
      page: 1,
      limit: 10,
      category: 'all',
      sort: 'rating-desc',
    });
  });

  it('updatePage changes only the page', async () => {
    const { parameters, updatePage } = await load();

    updatePage(4);

    expect(parameters).toEqual({
      featured: false,
      page: 4,
      limit: 10,
      category: 'all',
      sort: 'rating-desc',
    });
  });

  it('updateLimit changes only the limit', async () => {
    const { parameters, updateLimit } = await load();

    updateLimit(25);

    expect(parameters).toEqual({
      featured: false,
      page: 1,
      limit: 25,
      category: 'all',
      sort: 'rating-desc',
    });
  });

  it('updateCategory changes only the category', async () => {
    const { parameters, updateCategory } = await load();

    updateCategory('puzzle');

    expect(parameters).toEqual({
      featured: false,
      page: 1,
      limit: 10,
      category: 'puzzle',
      sort: 'rating-desc',
    });
  });

  it('updateSort changes only the sort', async () => {
    const { parameters, updateSort } = await load();

    updateSort('name-asc');

    expect(parameters).toEqual({
      featured: false,
      page: 1,
      limit: 10,
      category: 'all',
      sort: 'name-asc',
    });
  });

  it.each([
    'updatePage',
    'updateLimit',
    'updateCategory',
    'updateSort',
  ] as const)('%s returns the same shared object it mutates', async (name) => {
    const module = await load();
    const update = module[name] as (value: never) => unknown;

    expect(update('x' as never)).toBe(module.parameters);
  });

  it('keeps earlier updates when several are applied in a row', async () => {
    const { parameters, updateCategory, updateLimit, updatePage, updateSort } =
      await load();

    updateCategory('puzzle');
    updateSort('rating-asc');
    updateLimit(20);
    updatePage(3);

    expect(parameters).toEqual({
      featured: false,
      page: 3,
      limit: 20,
      category: 'puzzle',
      sort: 'rating-asc',
    });
  });
});
