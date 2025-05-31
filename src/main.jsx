import React from 'react';
import { createRoot } from 'react-dom/client';
// Swap BrowserRouter for HashRouter so routing works on GitHub Pages
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles/components.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
