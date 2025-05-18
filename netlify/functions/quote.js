import fetch from 'node-fetch';

export async function handler(event) {
  const symbol = event.queryStringParameters.symbol;
  const key    = process.env.VITE_FINNHUB_API_KEY;
  const res    = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`
  );
  const data   = await res.json();
  return {
    statusCode: res.status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
}
