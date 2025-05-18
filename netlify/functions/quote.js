// netlify/functions/quote.js
export async function handler(event) {
  const symbol = event.queryStringParameters.symbol;
  const key    = process.env.VITE_FINNHUB_API_KEY;

  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Finnhub API key in environment.' })
    };
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`;
    const res = await fetch(url);

    if (!res.ok) {
      // Finnhub returned a non-2xx status
      const text = await res.text();
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: `Finnhub error for ${symbol}: ${text}` })
      };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    // Network or other unexpected error
    return {
      statusCode: 502,
      body: JSON.stringify({ error: `Proxy exception: ${err.message}` })
    };
  }
}
