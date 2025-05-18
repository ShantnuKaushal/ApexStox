import React from 'react';

export default function StockList({
  stocks,
  tracked,
  onToggle,
  onSelect,
  selected
}) {
  return (
    <ul className="stock-list">
      {stocks.map(s => (
        <li
          key={s.symbol}
          className={[
            'stock-list__item',
            tracked.has(s.symbol) && 'stock-list__item--tracked',
            s.symbol === selected && 'stock-list__item--selected'
          ].filter(Boolean).join(' ')}
          onClick={() => onSelect(s.symbol)}
        >
          <div>
            <strong>{s.symbol}</strong> {s.current.toFixed(2)} ({s.changePct}%)
          </div>
          <button
            className="stock-list__toggle"
            onClick={e => {
              e.stopPropagation();
              onToggle(s.symbol);
            }}
          >
            {tracked.has(s.symbol) ? '×' : '+'}
          </button>
        </li>
      ))}
    </ul>
  );
}
