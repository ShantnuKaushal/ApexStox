import React from 'react';

export default function StockDetail({ data }) {
  if (!data) return <div>Select a stock to see details.</div>;

  return (
    <div className="stock-detail">
      {data.logo && (
        <img
          src={data.logo}
          alt={`${data.symbol} logo`}
          className="stock-detail__logo"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
      )}

      <h2>{data.name}</h2>
      <div className="stock-detail__symbol">{data.symbol}</div>

      <div className="stock-detail__grid">
        {/* First row */}
        <div className="stock-detail__item">
          <div className="stock-detail__label">Price</div>
          <div className="stock-detail__value">{data.current.toFixed(2)}</div>
        </div>
        <div className="stock-detail__item">
          <div className="stock-detail__label">High</div>
          <div className="stock-detail__value">{data.high}</div>
        </div>
        <div className="stock-detail__item">
          <div className="stock-detail__label">Open</div>
          <div className="stock-detail__value">{data.open}</div>
        </div>

        {/* Second row */}
        <div className="stock-detail__item">
          <div className="stock-detail__label">Change</div>
          <div className="stock-detail__value">{data.changePct}%</div>
        </div>
        <div className="stock-detail__item">
          <div className="stock-detail__label">Low</div>
          <div className="stock-detail__value">{data.low}</div>
        </div>
        <div className="stock-detail__item">
          <div className="stock-detail__label">Prev Close</div>
          <div className="stock-detail__value">{data.prevClose}</div>
        </div>
      </div>
    </div>
  );
}
