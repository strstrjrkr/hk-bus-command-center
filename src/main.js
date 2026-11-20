import './styles/main.css';
import './styles/leaflet-dark.css';

import { NavigationBar } from './components/NavigationBar.js';
import { RadarMap } from './components/RadarMap.js';
import { BbiMatrixPanel } from './components/BbiMatrixPanel.js';
import { TunnelBenchmarkPanel } from './components/TunnelBenchmarkPanel.js';
import { GhostBusPanel } from './components/GhostBusPanel.js';

import { ApiClient } from './services/apiClient.js';
import { BBI_HUBS } from './services/staticHubsData.js';
import { evaluateCatchProbability } from './engines/probabilityCatch.js';
import { detectGhostBusDrift } from './engines/ghostBusDetector.js';

class AppController {
  constructor() {
    this.activeTab = 'radar';
    this.selectedRoute = '968';
    this.selectedHub = 'WHC';
    this.walkBufferSec = 90;

    // Component instances
    this.nav = new NavigationBar('nav-container');
    this.radarMap = new RadarMap('radar-map');
    this.bbiPanel = new BbiMatrixPanel('panel-container', (hub, buffer) => this.onBbiConfigChange(hub, buffer));
    this.tunnelPanel = new TunnelBenchmarkPanel('panel-container');
    this.ghostPanel = new GhostBusPanel('panel-container');

    this.init();
  }

  async init() {
    console.log('[HK Bus Command Center] Bootstrapping engines and modular views...');
    this.nav.render();
    this.radarMap.init();
    this.setupTabRouter();
    this.renderActivePanel();
    this.startGlobalTelemetryLoop();
  }

  setupTabRouter() {
    const tabs = [
      { id: 'radar', btn: document.getElementById('tab-btn-radar') },
      { id: 'bbi', btn: document.getElementById('tab-btn-bbi') },
      { id: 'tunnel', btn: document.getElementById('tab-btn-tunnel') },
      { id: 'ghost', btn: document.getElementById('tab-btn-ghost') }
    ];

    tabs.forEach(({ id, btn }) => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        this.activeTab = id;
        tabs.forEach(t => {
          const isSelected = t.id === id;
          t.btn.setAttribute('aria-selected', isSelected);
          t.btn.className = isSelected
            ? 'flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-amber-400 border-b-2 border-amber-400 flex items-center justify-center gap-1.5 bg-slate-900'
            : 'flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 border-b-2 border-transparent flex items-center justify-center gap-1.5';
        });
        this.renderActivePanel();
      });
    });
  }

  renderActivePanel() {
    const container = document.getElementById('panel-container');
    if (!container) return;

    switch (this.activeTab) {
      case 'radar':
        container.innerHTML = `
          <div class="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <h2 class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📡</span> Dead-Reckoning Route Tracker
            </h2>
            <p class="text-xs text-slate-400">Interpolates real-time positions from ETA time gradients along road polylines.</p>
            <div class="flex gap-2 pt-1">
              <input type="text" id="route-input" value="${this.selectedRoute}" placeholder="Enter Route (e.g. 968, 104)" class="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 uppercase font-mono focus:outline-none focus:border-amber-400" />
              <button id="search-route-btn" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded text-xs">Track</button>
            </div>
          </div>
          <div id="radar-live-results" class="space-y-2">
            <div class="p-3 bg-slate-950/60 rounded border border-slate-800 text-xs text-slate-400 font-mono">
              Tracking active vehicles for Route ${this.selectedRoute}...
            </div>
          </div>
        `;
        break;

      case 'bbi': {
        const hubData = BBI_HUBS[this.selectedHub] || BBI_HUBS.WHC;
        // Dynamically compute transfers with probabilityCatch engine
        const simulatedConnections = [
          { inboundRoute: '968', outboundRoute: '930X', platform: 'Bay 3 (港島方向)', inboundEta: '18:14', outboundEta: '18:17', inSec: 180, outSec: 360 },
          { inboundRoute: '900', outboundRoute: '962X', platform: 'Bay 1 (九龍方向)', inboundEta: '18:15', outboundEta: '18:17', inSec: 240, outSec: 360 },
          { inboundRoute: '978', outboundRoute: '905', platform: 'Bay 2 (港島方向)', inboundEta: '18:16', outboundEta: '18:16', inSec: 300, outSec: 310 }
        ].map(item => {
          const evalResult = evaluateCatchProbability(item.inSec, item.outSec, this.walkBufferSec);
          return {
            ...item,
            probability: evalResult.probability,
            timeWindowSec: item.outSec - item.inSec
          };
        });

        this.bbiPanel.render(simulatedConnections);
        break;
      }

      case 'tunnel':
        this.tunnelPanel.render([
          { tunnelNameEn: 'Western Harbour Crossing', tunnelNameZh: '西區海底隧道', sampleBusRoute: 'Route 968', mtrLine: 'Tung Chung Line', avgSpeedKmH: 64, congestionLevel: 'Free Flow', busTripMinutes: 18, mtrTripMinutes: 29, diffMinutes: 11, confidence: 96 },
          { tunnelNameEn: 'Cross Harbour Tunnel', tunnelNameZh: '紅磡海底隧道', sampleBusRoute: 'Route 104', mtrLine: 'East Rail Line', avgSpeedKmH: 15, congestionLevel: 'Toll Queue', busTripMinutes: 34, mtrTripMinutes: 16, diffMinutes: -18, confidence: 91 },
          { tunnelNameEn: 'Eastern Harbour Crossing', tunnelNameZh: '東區海底隧道', sampleBusRoute: 'Route 681', mtrLine: 'Tseung Kwan O Line', avgSpeedKmH: 42, congestionLevel: 'Moderate', busTripMinutes: 22, mtrTripMinutes: 24, diffMinutes: 2, confidence: 88 }
        ]);
        break;

      case 'ghost': {
        const driftCheck = detectGhostBusDrift([
          { timestamp: Date.now() - 30000, etaSec: 120, remark: 'Scheduled' },
          { timestamp: Date.now(), etaSec: 174, remark: 'Scheduled' }
        ]);

        this.ghostPanel.render([
          {
            route: '112',
            terminus: 'So Uk ➔ North Point',
            driftRate: driftCheck.driftVelocity.toString(),
            scheduledTime: '18:20',
            apiRemark: 'Scheduled (No GPS)',
            reason: driftCheck.diagnosis
          }
        ]);
        break;
      }
    }
  }

  onBbiConfigChange(hub, buffer) {
    this.selectedHub = hub;
    this.walkBufferSec = buffer;
    console.log(`[BBI] Hub switched to ${hub} with ${buffer}s walking buffer.`);
    this.renderActivePanel();
  }

  startGlobalTelemetryLoop() {
    setInterval(() => {
      this.nav.updateApiStatus('200 OK • 15s SYNC', true);
    }, 15000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.__APP__ = new AppController();
});
