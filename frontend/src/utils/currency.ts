// src/utils/currency.ts
export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';

const CURRENCY_LOCALE: Record<Currency, string> = {
  USD: 'en-US',
  INR: 'en-IN',
  EUR: 'de-DE',  // pick any EU locale; adjust as needed
  GBP: 'en-GB',
};

const rateCache = new Map<string, { rate: number; expires: number }>();
const TTL_MS = 1000 * 60 * 30; // 30 minutes

export async function fetchExchangeRate(from: Currency, to: Currency): Promise<number> {
  if (from === to) return 1;

  const key = `${from}_${to}`;
  const cached = rateCache.get(key);
  const now = Date.now();

  if (cached && cached.expires > now) return cached.rate;

  // OPTION A: call your backend proxy if available (recommended)
  // const res = await fetch(`/api/exchange-rate?from=${from}&to=${to}`);

  // OPTION B: direct public API (works in browser; Frankfurter has CORS enabled)
  const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
  if (!res.ok) throw new Error('Failed to fetch exchange rate');

  const data = await res.json() as { rates: Record<string, number> };
  const rate = data.rates[to];

  if (typeof rate !== 'number') {
    throw new Error(`No rate for ${from}->${to}`);
  }

  rateCache.set(key, { rate, expires: now + TTL_MS });
  return rate;
}

export function formatMoney(amount: number, currency: Currency) {
  const locale = CURRENCY_LOCALE[currency] ?? 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
