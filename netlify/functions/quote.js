export async function handler(event) {
  const symbol = event.queryStringParameters.symbol;
  const key    = process.env.VITE_FINNHUB_API_KEY;

  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing API key.' })
    };
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`;
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: text })
      };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: err.message })
    };
  }
}
