# ApexStox

This repository contains the source code for **ApexStox**, an app built with Vite + React, HTML, CSS, and JavaScript. It lets users monitor the top 15 public companies by market cap in real time, filter and search among them, and “track” favorites all in one place.

## Features
  **Dashboard**  
  - **Stock List**: Displays the top 15 tickers sorted by market cap with current price and daily percent change. Users can search, filter (all / tracked / untracked), and click “+” to track or “×” to untrack. Tracked items highlight in a distinct background.  
  - **Detail Pane**: Shows full quote data (price, high, low, open, prev close) and company logo for the selected ticker. Data refreshes on a 10-minute interval.  
  - **Tracking Banner**: Toast-style notification when a stock is added or removed from your tracked list.
    
- **Responsive & Modern UI**  
  Uses CSS variables, clip-paths, subtle gradients, and mesh overlays for a unique, polished aesthetic. Components animate on hover, and layouts adapt gracefully to different screen sizes.

## Technologies Used

- **Vite** for fast development startup & bundling  
- **React** with hooks and React Router v6 for SPA routing  
- **CSS3** (variables, grid, clip-path, keyframes) for custom theming and animations  
- **JavaScript (ES6+)** for API polling logic, list filtering, and state management  
- **Finnhub API** for free real-time stock data  

## Getting Started

### Prerequisites

- Node.js (Latest Version)  
- A Finnhub API key (sign up at https://finnhub.io/)  

### Clone & Install

```bash
git clone https://github.com/ShantnuKaushal/ApexStox.git
cd ApexStox
npm install
```
### Create a .env.local file in the project root with your Finnhub key:
```bash
VITE_FINNHUB_API_KEY=your_finnhub_api_key_here
```
### Run Locally
```bash
npm run dev
```
