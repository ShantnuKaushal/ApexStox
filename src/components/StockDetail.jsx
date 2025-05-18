import React from 'react';

export default function StockDetail({ data }) {
  if (!data) return <div>Select a stock to see details.</div>;

  return (
    <div className="stock-detail">
      {}
      {data.logo && (
        <img
          src={data.logo}
          alt={`${data.symbol} logo`}
          className="stock-detail__logo"
          onError={e => { e.currentTarget.style.display = 'none'; }}
          style={{
            display: 'block',
            maxWidth: '100px',
            margin: '0 auto 1rem'
          }}
        />
      )}

      <h2>{data.name}</h2>
      <div className="stock-detail__symbol">{data.symbol}</div>

      <p>Price: {data.current.toFixed(2)}</p>
      <p>Change: {data.changePct}%</p>
      <p>High: {data.high}</p>
      <p>Low: {data.low}</p>
      <p>Open: {data.open}</p>
      <p>Prev Close: {data.prevClose}</p>
    </div>
  );
}
