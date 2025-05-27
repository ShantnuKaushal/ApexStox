import React, { useState, useEffect } from 'react';
import { fetchQuote, fetchProfile, fetchTracked, toggleTracked } from '../api';
import { TOP15, SYMBOL_NAME_MAP } from '../symbols';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import StockList from '../components/StockList';
import StockDetail from '../components/StockDetail';
import TrackingBanner from '../components/TrackingBanner';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [profiles,    setProfiles]   = useState({});
  const [quotes,      setQuotes]     = useState([]);
  const [loadedCount, setCount]      = useState(0);
  const [error,       setError]      = useState(null);
  const [tracked,     setTracked]    = useState(new Set());
  const [filter,      setFilter]     = useState('all');
  const [search,      setSearch]     = useState('');
  const [selected,    setSelected]   = useState(null);
  const [banner,      setBanner]     = useState('');

  // Redirect to login if no token
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // Load this user's tracked set
  useEffect(() => {
    if (token) {
      fetchTracked(token)
        .then(list => setTracked(new Set(list)))
        .catch(console.error);
    }
  }, [token]);

  // Load profiles for TOP15
  useEffect(() => {
    (async () => {
      const map = {};
      await Promise.all(
        TOP15.map(async sym => {
          try {
            const p = await fetchProfile(sym);
            map[sym] = p;
          } catch (e) {
            console.error(`Profile error for ${sym}:`, e);
            map[sym] = {
              name: SYMBOL_NAME_MAP[sym] || sym,
              logo: ''
            };
          }
        })
      );
      setProfiles(map);
    })();
  }, []);

  // Fetch quotes in chunks, refresh every 10 minutes
  const loadQuotes = async () => {
    setError(null);
    setQuotes([]);
    setCount(0);

    const results = [];
    const chunkSize = 30;
    for (let i = 0; i < TOP15.length; i += chunkSize) {
      const slice = TOP15.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        slice.map(async sym => {
          try {
            return await fetchQuote(sym);
          } catch (e) {
            console.error(`Quote error for ${sym}:`, e);
            return null;
          }
        })
      );
      chunkResults.forEach(q => q && results.push(q));
      setCount(c => c + chunkResults.filter(q => q).length);
      if (i + chunkSize < TOP15.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    setQuotes(results);
    if (!selected && results.length) {
      setSelected(TOP15[0]);
    }
  };

  useEffect(() => {
    loadQuotes();
    const id = setInterval(loadQuotes, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Combine quote + profile
  const data = quotes.map((q, i) => {
    const sym  = TOP15[i];
    const prof = profiles[sym] || {};
    return {
      symbol:    sym,
      name:      prof.name || SYMBOL_NAME_MAP[sym] || sym,
      logo:      prof.logo || '',
      current:   q.c,
      changePct: ((q.c - q.pc) / q.pc * 100).toFixed(2),
      high:      q.h,
      low:       q.l,
      open:      q.o,
      prevClose: q.pc
    };
  });

  // Toggle tracked on server and update banner
  const handleToggle = async sym => {
    try {
      const updated = await toggleTracked(sym, token);
      setTracked(new Set(updated));
      const action = updated.includes(sym) ? 'added to' : 'removed from';
      setBanner(`${sym} ${action} tracked`);
      setTimeout(() => setBanner(''), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Apply filter & search
  const filtered = data.filter(item => {
    if (filter === 'tracked'   && !tracked.has(item.symbol)) return false;
    if (filter === 'untracked' &&  tracked.has(item.symbol)) return false;
    if (search &&
        !item.symbol.toLowerCase().includes(search.toLowerCase()) &&
        !item.name.toLowerCase().includes(search.toLowerCase())
    ) return false;
    return true;
  });

  if (error) {
    return <div className="dashboard__error">Error: {error}</div>;
  }
  if (!quotes.length) {
    return (
      <div className="dashboard__loading">
        Loading… {loadedCount} of {TOP15.length}
      </div>
    );
  }

  return (
    <div className="dashboard">
      {banner && <TrackingBanner message={banner} />}

      <div className="dashboard__sidebar">
        <SearchBar value={search} onChange={setSearch} />
        <FilterDropdown value={filter} onChange={setFilter} />
        <StockList
          stocks={filtered}
          tracked={tracked}
          onToggle={handleToggle}
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
