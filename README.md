# HK Bus Radar & BBI Command Center

High-precision Hong Kong bus dead-reckoning radar, real-time Bus-Bus Interchange (BBI) connection matrix, tunnel speed benchmark vs. MTR, and automated ghost bus (收車) irregularity detector.

## Features

- **Live Dead-Reckoning Radar:** Interpolates moving bus locations between stops using real-time ETA gradients over OpenStreetMap road polylines.
- **BBI Transfer Matrix:** Models connection probability using Gaussian distribution over cross-platform walking buffers for Western Harbour Crossing (WHC), Tuen Mun Road (TMTCI), Tai Lam Tunnel (TLTI), and Cross-Harbour Tunnel (CHT).
- **Cross-Harbour Speed vs MTR:** Compares Transport Department Traffic Speed Map (TSM) corridor speeds against MTR line journey times.
- **Ghost Bus Sentinel:** Automatically identifies canceled departures and phantom trips by evaluating ETA timestamp drift velocity ($\gamma \ge 0.85$ s/s).

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local unified Netlify Edge environment (Vite + Serverless functions)
npm install -g netlify-cli
netlify dev
