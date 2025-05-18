// src/App.jsx
import React, { useEffect, useState } from 'react';
import { fetchQuote } from './api';
import { TOP50, SYMBOL_NAME_MAP } from './symbols';

export default function App() {
  const [data, setData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setData([]);
      setLoadedCount(0);
      const results = [];
      const chunkSize = 30;

      for (let i = 0; i < TOP50.length; i += chunkSize) {
        const chunk = TOP50.slice(i, i + chunkSize);
        // fire off up to 30 quote calls in parallel
        const quotes = await Promise.all(chunk.map(fetchQuote));

        quotes.forEach((quote, idx) => {
          const symbol = chunk[idx];
          const name = SYMBOL_NAME_MAP[symbol] || symbol;
          const changePct = ((quote.c - quote.pc) / quote.pc * 100).toFixed(2);
          results.push({
            symbol,
            name,
            current: quote.c,
            changePct,
            high: quote.h,
            low: quote.l,
            open: quote.o,
            prevClose: quote.pc
          });
        });

        setLoadedCount(count => count + chunk.length);

        // wait a second before next batch so we stay under 30/sec
        if (i + chunkSize < TOP50.length) {
          // only pause between batches
          await new Promise(res => setTimeout(res, 1000));
        }
      }

      setData(results);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data.length) return (
    <div>
      Loading… {loadedCount} of {TOP50.length}
    </div>
  );

  return (
    <div className="container">
      <h1>Top 50 Companies</h1>
      <table>
        <thead>
          <tr>
            <th>Symbol</th><th>Name</th><th>Price</th><th>% Chg</th>
            <th>High</th><th>Low</th><th>Open</th><th>Prev Close</th>
          </tr>
        </thead>
        <tbody>
          {data.map(c => (
            <tr key={c.symbol}>
              <td>{c.symbol}</td><td>{c.name}</td><td>{c.current}</td>
              <td>{c.changePct}%</td><td>{c.high}</td><td>{c.low}</td>
              <td>{c.open}</td><td>{c.prevClose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
