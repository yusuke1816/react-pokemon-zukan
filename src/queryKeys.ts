// src/queryKeys.ts
export const apiQueryKeys = {
    pokemon: {
      list: () => ['pokemon', 'list'],
      detail: (id: string) => ['pokemon', 'detail', id],
    },
  };
  