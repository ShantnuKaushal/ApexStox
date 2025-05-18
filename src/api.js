const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE = '/api/v1';

export async function fetchQuote(symbol) {
  const url = `${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Quote error for ${symbol}: ${res.statusText}`);
  return res.json();
}
