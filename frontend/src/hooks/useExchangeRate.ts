// src/hooks/useExchangeRate.ts
import { useEffect, useState } from 'react';
import { fetchExchangeRate, Currency } from '@/utils/currency';

export function useExchangeRate(from: Currency, to: Currency) {
  const [rate, setRate] = useState<number>(from === to ? 1 : NaN);
  const [loading, setLoading] = useState(from !== to);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(from !== to);
        setError(null);
        const r = await fetchExchangeRate(from, to);
        if (alive) setRate(r);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Rate fetch failed');
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => { alive = false; };
  }, [from, to]);

  return { rate: Number.isNaN(rate) ? 1 : rate, loading, error };
}
