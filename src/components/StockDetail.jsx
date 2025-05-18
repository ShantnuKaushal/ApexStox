import React from 'react';

export default function StockDetail({ data }) {
  if (!data) return <div>Select a stock to see details.</div>;
  return (
    <div className="stock-detail">
      <h2>{data.name}</h2>
      <div className="stock-detail__symbol">{data.symbol}</div>
      <p><b>Price:</b> {data.current.toFixed(2)}</p>
      <p><b>Change:</b> {data.changePct}%</p>
      <p><b>High:</b> {data.high}</p>
      <p><b>Low:</b> {data.low}</p>
      <p><b>Open:</b> {data.open}</p>
      <p><b>Prev Close:</b> {data.prevClose}</p>
    </div>
  );
}
