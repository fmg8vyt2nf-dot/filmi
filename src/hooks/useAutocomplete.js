import { useMemo } from 'react';

export function useAutocomplete(input, movies) {
  return useMemo(() => {
    if (!input || input.length < 2) return [];
    const q = input.toLowerCase();
    return movies
      .filter(m => m.title.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.title.toLowerCase().startsWith(q);
        const bStarts = b.title.toLowerCase().startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.title.localeCompare(b.title);
      })
      .slice(0, 8);
  }, [input, movies]);
}
