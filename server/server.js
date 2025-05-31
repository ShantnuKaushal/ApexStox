// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch'); // Using node-fetch@2 so require(...) works

const authRoutes = require('./routes/auth');
const trackedRoutes = require('./routes/tracked');

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

// --- Define TOP15 here (must exactly match client’s TOP15) ---
const TOP15 = [
  'MSFT','NVDA','AAPL','AMZN','META',
  'AVGO','TSLA','GOOGL','BRK.B','GOOG',
  'JPM','V','LLY','NFLX','MA'
];

// In‐memory caches:
let cachedQuotes = [];              // Array of { symbol, c, pc, h, l, o, t } or nulls
let cachedProfiles = {};            // Object { symbol: { name, logo } }

// Fetch all quotes from Finnhub and store in cachedQuotes
async function fetchAllQuotes() {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    console.error('FINNHUB_API_KEY is not set in .env');
    return;
  }

  try {
    const results = await Promise.all(
      TOP15.map(async (symbol) => {
        const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
          console.error(`Finnhub quote error for ${symbol}: ${res.statusText}`);
          return null;
        }
        return res.json();
      })
    );

    cachedQuotes = results.map((q, i) => {
      if (q === null) return null;
      return {
        symbol: TOP15[i],
        c: q.c,
        pc: q.pc,
        h: q.h,
        l: q.l,
        o: q.o,
        t: q.t
      };
    });

    console.log(
      `Fetched ${cachedQuotes.filter(q => q).length}/${TOP15.length} quotes at ${new Date().toLocaleTimeString()}`
    );
  } catch (err) {
    console.error('Error fetching quotes:', err);
  }
}

// Fetch all profiles from Finnhub and store in cachedProfiles
async function fetchAllProfiles() {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    console.error('FINNHUB_API_KEY is not set in .env');
    return;
  }

  try {
    const profileResults = await Promise.all(
      TOP15.map(async (symbol) => {
        const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
          console.error(`Finnhub profile error for ${symbol}: ${res.statusText}`);
          return null;
        }
        return res.json();
      })
    );

    const newProfiles = {};
    profileResults.forEach((p, idx) => {
      const sym = TOP15[idx];
      if (p) {
        newProfiles[sym] = {
          name: p.name || sym,
          logo: p.logo || ''
        };
      } else {
        newProfiles[sym] = {
          name: sym,
          logo: ''
        };
      }
    });

    cachedProfiles = newProfiles;
    console.log(`Fetched profiles for ${TOP15.length} symbols at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error('Error fetching profiles:', err);
  }
}

// Immediately fetch both caches at startup:
fetchAllQuotes();
fetchAllProfiles();

// Schedule quotes and profiles to refresh every 2 minutes:
setInterval(fetchAllQuotes, 2 * 60 * 1000);
setInterval(fetchAllProfiles, 2 * 60 * 1000);

// Endpoint to serve cached quotes:
app.get('/quotes', (req, res) => {
  res.json({ quotes: cachedQuotes });
});

// Endpoint to serve cached profiles:
app.get('/profiles', (req, res) => {
  res.json({ profiles: cachedProfiles });
});

// Mount existing auth/tracked routes unmodified:
app.use('/auth', authRoutes);
app.use('/tracked', trackedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening using ${PORT}`));
