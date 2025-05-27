// src/api.js

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE    = '/api/v1';    // Finnhub proxy
const AUTH    = '/auth';      // Auth endpoints
const TRACKED = '/tracked';   // Tracked‐stocks endpoints

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
  console.log('✍️ signup response:', data);
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
  console.log('🔑 login response:', data);
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data.token;
}

export async function fetchTracked(token) {
  const res = await fetch(TRACKED, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('📦 fetchTracked response:', data);
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
  console.log('⚙️ toggleTracked response:', data);
  if (!res.ok) throw new Error(data.message || 'Toggling tracked failed');
  return data.tracked;
}
