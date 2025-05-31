// src/api.js

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE    = '/api/v1';    // Finnhub proxy (still used by other endpoints if needed)
const AUTH    = '/auth';      // Auth routes
const TRACKED = '/tracked';   // Tracked-stocks routes

// These two are the new cached endpoints:
const QUOTES  = '/quotes';
const PROFILES = '/profiles';

export async function fetchCachedQuotes() {
  const res = await fetch(QUOTES);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fetchCachedQuotes failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  // data.quotes is an array of { symbol, c, pc, h, l, o, t } (or null entries)
  return data.quotes;
}

export async function fetchAllProfiles() {
  const res = await fetch(PROFILES);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fetchAllProfiles failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  // data.profiles is an object { symbol: { name, logo } }
  return data.profiles;
}

// We keep the existing quotefetchers in case you need them for other endpoints:
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

export async function signup(email, password, password2) {
  const res = await fetch(`${AUTH}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, password2 })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Signup failed');
  return data.token;
}

export async function login(email, password) {
  const res = await fetch(`${AUTH}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data.token;
}

export async function fetchTracked(token) {
  const res = await fetch(TRACKED, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Fetching tracked failed');
  return data.tracked;
}

export async function toggleTracked(symbol, token) {
  const res = await fetch(TRACKED, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ symbol })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Toggling tracked failed');
  return data.tracked;
}
