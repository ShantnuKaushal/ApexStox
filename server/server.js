// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch'); // npm install node-fetch

const authRoutes = require('./routes/auth');
const trackedRoutes = require('./routes/tracked');

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

// --- Define TOP15 here (duplicate from client) ---
const TOP15 = [
  'MSFT','NVDA','AAPL','AMZN','META',
  'AVGO','TSLA','GOOGL','BRK.B','GOOG',
  'JPM','V','LLY','NFLX','MA'
];

// This will hold the latest quotes fetched from Finnhub:
let cachedQuotes = [];

// Function to fetch all quotes from Finnhub and store in cachedQuotes:
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
          console.error(`Finnhub error for ${symbol}: ${res.statusText}`);
          return null;
        }
        return res.json();
      })
    );
    // Filter out any nulls and keep the order aligned with TOP15 (nulls remain if fetch failed)
    cachedQuotes = results.map((q, i) => {
      if (q === null) {
        return null;
      }
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
    console.log(`Fetched ${cachedQuotes.filter(q => q).length}/${TOP15.length} quotes at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error('Error fetching quotes:', err);
  }
}

// Immediately fetch once and then schedule every 2 minutes (120_000ms)
fetchAllQuotes();
setInterval(fetchAllQuotes, 2 * 60 * 1000);

// Expose endpoint for clients to read the cached quotes
app.get('/quotes', (req, res) => {
  // Return the array of quote objects (in the same TOP15 order)
  res.json({ quotes: cachedQuotes });
});

// Mount existing routes unchanged:
app.use('/auth', authRoutes);
app.use('/tracked', trackedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
