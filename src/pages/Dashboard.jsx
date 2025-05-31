// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import {
  fetchAllProfiles,
  fetchCachedQuotes,
  fetchTracked,
  toggleTracked
} from '../api';
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

  // profiles: { symbol: { name, logo } }
  const [profiles,    setProfiles]   = useState({});
  // quotes: [ { symbol, c, pc, h, l, o, t } ]
  const [quotes,      setQuotes]     = useState([]);
  const [loadedCount, setCount]      = useState(0);
  const [error,       setError]      = useState(null);
  const [tracked,     setTracked]    = useState(new Set());
  const [filter,      setFilter]     = useState('all');
  const [search,      setSearch]     = useState('');
  const [selected,    setSelected]   = useState(null);
  const [banner,      setBanner]     = useState('');

  // 1) Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // 2) Load this user's tracked set once (no polling needed)
  useEffect(() => {
    if (token) {
      fetchTracked(token)
        .then(list => setTracked(new Set(list)))
        .catch(console.error);
    }
  }, [token]);

  // 3) Poll for profiles every 2 minutes (and once immediately)
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const profMap = await fetchAllProfiles();
        setProfiles(profMap);
      } catch (err) {
        console.error('Error loading cached profiles:', err);
        // fallback: if cachedProfiles fails, use SYMBOL_NAME_MAP, no logos
        const fallback = {};
        TOP15.forEach(sym => {
          fallback[sym] = { name: SYMBOL_NAME_MAP[sym] || sym, logo: '' };
        });
        setProfiles(fallback);
      }
    };

    // Fetch once immediately
    loadProfiles();
    // Then every 2 minutes
    const profInterval = setInterval(loadProfiles, 2 * 60 * 1000);
    return () => clearInterval(profInterval);
  }, []);

  // 4) Poll for quotes every 2 minutes (and once immediately)
  useEffect(() => {
    const loadQuotes = async () => {
      setError(null);
      try {
        const rawQuotes = await fetchCachedQuotes();
        const validQuotes = rawQuotes.filter(q => q !== null);
        setQuotes(validQuotes);
        setCount(validQuotes.length);

        // If nothing selected yet, pick first symbol
        if (!selected && validQuotes.length > 0) {
          setSelected(validQuotes[0].symbol);
        }
      } catch (err) {
        console.error('Error fetching cached quotes:', err);
        setError(err.message);
      }
    };

    // Fetch once immediately
    loadQuotes();
    // Then every 2 minutes
    const quoteInterval = setInterval(loadQuotes, 2 * 60 * 1000);
    return () => clearInterval(quoteInterval);
  }, [selected]);

  // 5) Combine quotes + profiles into data array
  const data = quotes.map((q) => {
    const sym  = q.symbol;
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

  // 6) Toggle tracked on server and show banner
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

  // 7) Logout clears token and navigates to landing
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // 8) Filter & search logic
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

  // 9) Render loading, error, or dashboard layout
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
      {/* Logout button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* Tracking banner */}
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
