import React, { useState, useEffect } from 'react';
import { fetchQuote } from '../api';
import { TOP50, SYMBOL_NAME_MAP } from '../symbols';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import StockList from '../components/StockList';
import StockDetail from '../components/StockDetail';
import TrackingBanner from '../components/TrackingBanner';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [error, setError] = useState(null);
  const [tracked, setTracked] = useState(new Set());
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [banner, setBanner] = useState('');

  const loadData = async () => {
    try {
      setData([]);
      setLoadedCount(0);
      const results = [];
      const chunkSize = 30;
      for (let i = 0; i < TOP50.length; i += chunkSize) {
        const chunk = TOP50.slice(i, i + chunkSize);
        const quotes = await Promise.all(chunk.map(fetchQuote));
        quotes.forEach((q, j) => {
          const sym = chunk[j];
          results.push({
            symbol: sym,
            name: SYMBOL_NAME_MAP[sym] || sym,
            current: q.c,
            changePct: ((q.c - q.pc) / q.pc * 100).toFixed(2),
            high: q.h,
            low: q.l,
            open: q.o,
            prevClose: q.pc
          });
        });
        setLoadedCount(c => c + chunk.length);
        if (i + chunkSize < TOP50.length) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      setData(results);
      if (!selected && results.length) {
        setSelected(results[0].symbol);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadData();
    const id = setInterval(loadData, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const toggleTrack = sym => {
    setTracked(prev => {
      const next = new Set(prev);
      if (next.has(sym)) next.delete(sym);
      else next.add(sym);
      return next;
    });
    setBanner(
      `${sym} ${tracked.has(sym) ? 'removed from' : 'added to'} tracked`
    );
    setTimeout(() => setBanner(''), 2000);
  };

  const filtered = data.filter(item => {
    if (!item) return false;
    if (filter === 'tracked' && !tracked.has(item.symbol)) return false;
    if (filter === 'untracked' && tracked.has(item.symbol)) return false;
    if (search && !item.symbol.toLowerCase().includes(search.toLowerCase())
      && !item.name.toLowerCase().includes(search.toLowerCase())
    ) return false;
    return true;
  });

  if (error) return <div className="dashboard__error">Error: {error}</div>;
  if (!data.length) return (
    <div className="dashboard__loading">
      Loading… {loadedCount} of {TOP50.length}
    </div>
  );

  return (
    <div className="dashboard">
      {banner && <TrackingBanner message={banner} />}
      <div className="dashboard__sidebar">
        <SearchBar value={search} onChange={setSearch} />
        <FilterDropdown value={filter} onChange={setFilter} />
        <StockList
          stocks={filtered}
          tracked={tracked}
          onToggle={toggleTrack}
          onSelect={setSelected}
          selected={selected}
        />
      </div>
      <div className="dashboard__detail">
        <StockDetail data={data.find(d => d.symbol === selected)} />
      </div>
    </div>
  );
}
