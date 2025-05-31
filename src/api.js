// src/api.js

// Render’s live backend URL:
const PROD_BASE = 'https://stock-tracker-api-j326.onrender.com';
// In development, leave this empty so that Vite’s proxy handles "/quotes", "/profiles", etc.
const DEV_BASE  = '';

// Vite automatically sets import.meta.env.PROD to true when you run `npm run build`
// and serves from gh-pages. In dev (`npm run dev`), import.meta.env.PROD is false.
export const API_BASE = import.meta.env.PROD ? PROD_BASE : DEV_BASE;


// Cached endpoints (quotes & profiles)
const QUOTES   = `${API_BASE}/quotes`;
const PROFILES = `${API_BASE}/profiles`;

// Auth and tracked endpoints
const AUTH    = `${API_BASE}/auth`;
const TRACKED = `${API_BASE}/tracked`;

// These remain unchanged (optional Finnhub proxy endpoints for dev, not used in production)
const FINNHUB_BASE = '/api/v1'; // Vite proxies /api/v1/* to Finnhub in dev
const API_KEY       = import.meta.env.VITE_FINNHUB_API_KEY;

// 1) Fetch cached quotes (array of { symbol, c, pc, h, l, o, t })
export async function fetchCachedQuotes() {
  const res = await fetch(QUOTES);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fetchCachedQuotes failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.quotes;
}

// 2) Fetch cached profiles (object mapping symbols → { name, logo })
export async function fetchAllProfiles() {
  const res = await fetch(PROFILES);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fetchAllProfiles failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.profiles;
}

// 3) Fallback quote fetcher (uses Finnhub proxy in dev; not typically used in production)
export async function fetchQuote(symbol) {
  const url = `${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Quote error for ${symbol}: ${res.statusText}`);
  return res.json();
}

// 4) Fallback profile fetcher (uses Finnhub proxy in dev; not typically used in production)
export async function fetchProfile(symbol) {
  const url = `${FINNHUB_BASE}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Profile error for ${symbol}: ${res.statusText}`);
  return res.json();
}

// 5) Sign up a new user
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

// 6) Log in an existing user
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

// 7) Fetch the currently tracked symbols for this user
export async function fetchTracked(token) {
  const res = await fetch(TRACKED, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Fetching tracked failed');
  return data.tracked;
}

// 8) Toggle a symbol in the tracked list for this user
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
