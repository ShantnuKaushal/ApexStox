const BASE = '/.netlify/functions';

export async function fetchQuote(symbol) {
  const res = await fetch(`${BASE}/quote?symbol=${encodeURIComponent(symbol)}`);
  if (!res.ok) throw new Error(`Quote error for ${symbol}: ${res.statusText}`);
  return res.json();
}
