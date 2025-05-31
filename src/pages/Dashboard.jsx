// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  fetchProfile,
  fetchTracked,
  toggleTracked
} from '../api'; // note: no more fetchQuote
import { TOP15, SYMBOL_NAME_MAP } from '../symbols';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import StockList from '../components/StockList';
import StockDetail from '../components/StockDetail';
import TrackingBanner from '../components/TrackingBanner';
import Footer from '../components/Footer';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [profiles,    setProfiles]   = useState({});
  const [quotes,      setQuotes]     = useState([]);      // now holds array of { symbol, c, pc, h, l, o, t }
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

  // Load profiles for TOP15 (only once; we assume names/logos rarely change)
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

  // Helper to fetch cached quotes from our server
  const fetchCachedQuotes = async () => {
    setError(null);
    try {
      const res = await fetch('/quotes');
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      // data.quotes is an array of { symbol, c, pc, h, l, o, t }
      const validQuotes = data.quotes.filter(q => q !== null);
      setQuotes(validQuotes);
      setCount(validQuotes.length);
      if (!selected && validQuotes.length > 0) {
        setSelected(validQuotes[0].symbol);
      }
    } catch (err) {
      console.error('Error fetching cached quotes:', err);
      setError(err.message);
    }
  };

  // On mount, fetch once, then poll every 2 minutes
  useEffect(() => {
    fetchCachedQuotes();
    const id = setInterval(fetchCachedQuotes, 2 * 60 * 1000);
    return () => clearInterval(id);
  }, [selected]);

  // Combine “quote” + “profile” into a single data array
  const data = quotes.map((q, i) => {
    const sym  = q.symbol;              // TOP15[i] if you prefer, but q.symbol is explicit
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

  // Logout clears token and returns to landing
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Apply filter & search
  const filtered = data.filter(item => {
    if (filter === 'tracked'   && !tracked.has(item.symbol)) return false;
    if (filter === 'untracked' &&  tracked.has(item.symbol)) return false;
    if (
      search &&
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
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

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
        <Footer className="footer--dashboard" />
      </div>
    </div>
  );
}
