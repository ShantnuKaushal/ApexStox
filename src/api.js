// after: no key in the browser; Netlify handles it for you
const BASE = '/.netlify/functions';

export async function fetchQuote(symbol) {
  const url = `${BASE}/quote?symbol=${encodeURIComponent(symbol)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Quote error for ${symbol}: ${res.statusText}`);
  return res.json();
}
