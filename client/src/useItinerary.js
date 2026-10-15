import { useCallback, useEffect, useState } from "react";

const key = (destId) => `travl:itinerary:${destId}`;

function load(destId) {
  try {
    return JSON.parse(localStorage.getItem(key(destId))) || [];
  } catch {
    return [];
  }
}

export function useItinerary(destId) {
  const [items, setItems] = useState(() => load(destId));

  useEffect(() => setItems(load(destId)), [destId]);

  const update = useCallback(
    (fn) =>
      setItems((prev) => {
        const next = fn(prev);
        try {
          localStorage.setItem(key(destId), JSON.stringify(next));
        } catch {}
        return next;
      }),
    [destId]
  );

  const add = (place, day = 1) => update((p) => (p.some((x) => x.name === place.name) ? p : [...p, { ...place, day }]));
  const remove = (name) => update((p) => p.filter((x) => x.name !== name));
  const move = (name, day) => update((p) => p.map((x) => (x.name === name ? { ...x, day } : x)));
  const clear = () => update(() => []);

  return { items, add, remove, move, clear };
}
