import React from 'react';

export default function StockDetail({ data }) {
  if (!data) return <div>Select a stock to see details.</div>;
  return (
    <div className="stock-detail">
      <h2>{data.name} ({data.symbol})</h2>
      <p>Price: {data.current.toFixed(2)}</p>
      <p>Change: {data.changePct}%</p>
      <p>High: {data.high}</p>
      <p>Low: {data.low}</p>
      <p>Open: {data.open}</p>
      <p>Prev Close: {data.prevClose}</p>
    </div>
  );
}
