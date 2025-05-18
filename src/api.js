// src/api.js

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE    = '/api/v1';  // your proxy/functions endpoint

export async function fetchQuote(symbol) {
  const url = `${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Quote error for ${symbol}: ${res.statusText}`);
  return res.json();
}

export async function fetchProfile(symbol) {
  const url = `${BASE}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Profile error for ${symbol}: ${res.statusText}`);
  return res.json();
}
