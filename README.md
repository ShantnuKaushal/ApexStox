# MyStockTracker

[Check It Out!](https://shantnukaushal.github.io/ApexStox/)

ApexStox is a full‐stack application that lets users sign up, log in, and monitor the top 15 public companies by market cap in real time. Each user can search, filter, and “track” favorites; all tracked data is saved per account.

> **Note:** The backend may take a few seconds to spin up when first visiting the site. Please allow a moment for the backend to load before signing up and accessing the dashboard.

## Main Technologies

- **Frontend**  
  - Vite  
  - React (v19) with hooks and React Router (HashRouter)  
  - CSS3 (variables, grid, clip‐path, keyframes)  
  - gh‐pages for GitHub Pages deployment  

- **Backend**  
  - Node.js & Express  
  - MongoDB (Atlas) via Mongoose  
  - bcrypt for password hashing  
  - jsonwebtoken (JWT) for authentication  
  - node‐fetch for polling Finnhub  

- **External APIs**  
  - Finnhub (cached quotes & company profiles, refreshed every 2 minutes)

## Key Features

- **User Accounts & Authentication**  
  - Sign up (email + password), login, logout using JWT  
  - Each user’s “tracked” list is stored in MongoDB  

- **Dashboard**  
  - Displays top 15 stocks (price, daily % change, logo)  
  - Search and filter (All / Tracked / Untracked)  
  - Click “+” or “×” to add/remove from tracked  
  - Detail pane with full quote data (price, high, low, open, prev close)  
  - Server‐side cache refreshes quotes and profiles every 2 minutes so all users see the same data  

- **Responsive & Modern UI**  
  - CSS animations, gradients, and custom theming for a polished look  
  - Adaptable layouts for desktop and mobile
