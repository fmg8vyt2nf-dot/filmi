import { useState, useCallback } from 'react';
import { LS_KEYS } from '../utils/constants';

const EMPTY = { directors: {}, actors: {} };

function load() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.COLLECTOR) ?? 'null') ?? EMPTY; }
  catch { return EMPTY; }
}

export function useCollector() {
  const [data, setData] = useState(load);

  // Returns names that will be NEW discoveries BEFORE recording (so ResultsPage can show them)
  const getNewDiscoveries = useCallback((movie) => {
    const out = [];
    if (!data.directors[movie.director]) out.push({ type: 'Director', name: movie.director });
    if (!data.actors[movie.leadActor])   out.push({ type: 'Actor',    name: movie.leadActor });
    return out;
  }, [data]);

  const recordFilm = useCallback((movie) => {
    setData(prev => {
      const next = {
        directors: { ...prev.directors },
        actors:    { ...prev.actors },
      };

      // Director
      const dir = movie.director;
      if (!next.directors[dir]) next.directors[dir] = { count: 0, films: [] };
      if (!next.directors[dir].films.includes(movie.id)) {
        next.directors[dir].count++;
        next.directors[dir].films.push(movie.id);
      }

      // Lead actor
      const lead = movie.leadActor;
      if (!next.actors[lead]) next.actors[lead] = { count: 0, films: [] };
      if (!next.actors[lead].films.includes(movie.id)) {
        next.actors[lead].count++;
        next.actors[lead].films.push(movie.id);
      }

      // Supporting actor (tracked but not shown as discovery to keep it short)
      const supp = movie.supportingActor;
      if (!next.actors[supp]) next.actors[supp] = { count: 0, films: [] };
      if (!next.actors[supp].films.includes(movie.id)) {
        next.actors[supp].count++;
        next.actors[supp].films.push(movie.id);
      }

      localStorage.setItem(LS_KEYS.COLLECTOR, JSON.stringify(next));
      return next;
    });
  }, []);

  const sortedDirectors = Object.entries(data.directors)
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => b.count - a.count);

  const sortedActors = Object.entries(data.actors)
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => b.count - a.count);

  const totalDirectors = sortedDirectors.length;
  const totalActors    = sortedActors.length;
  const totalFilms     = sortedDirectors.reduce((s, d) => s + d.count, 0);

  return { data, recordFilm, getNewDiscoveries, sortedDirectors, sortedActors, totalDirectors, totalActors, totalFilms };
}
