import React from 'react';

export default function StockList({
  stocks,
  tracked,
  onSelect,
  onToggle,
  selected
}) {
  return (
    <ul className="stock-list">
      {stocks.map(stock => {
        const isTracked  = tracked.has(stock.symbol);
        const isSelected = stock.symbol === selected;

        return (
          <li
            key={stock.symbol}
            className={
              'stock-list__item' +
              (isTracked  ? ' stock-list__item--tracked'  : '') +
              (isSelected ? ' stock-list__item--selected' : '')
            }
            onClick={() => onSelect(stock.symbol)}
          >
            <div className="stock-list__info">
              {stock.logo && (
                <img
                  src={stock.logo}
                  alt={`${stock.symbol} logo`}
                  className="stock-list__logo"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              <div className="stock-list__meta">
                <span className="stock-list__symbol">
                  {stock.symbol}
                </span>
                <span className="stock-list__price">
                  {stock.current.toFixed(2)}
                </span>
              </div>
            </div>

            <span
              className={
                'stock-list__change ' +
                (stock.changePct >= 0
                  ? 'stock-list__change--positive'
                  : 'stock-list__change--negative')
              }
            >
              ({stock.changePct}%)
            </span>

            <button
              className="stock-list__toggle"
              onClick={e => {
                e.stopPropagation();
                onToggle(stock.symbol);
              }}
            >
              {isTracked ? '×' : '+'}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
