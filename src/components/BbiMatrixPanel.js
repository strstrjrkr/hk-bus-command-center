export class BbiMatrixPanel {
  constructor(containerId, onHubChange) {
    this.container = document.getElementById(containerId);
    this.onHubChange = onHubChange;
    this.currentHub = 'WHC';
    this.walkBufferSec = 90;
  }

  render(connections = []) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="space-y-4">
        <div class="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span> BBI Transfer Matrix
            </h2>
            <span class="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              4 HUBS ONLINE
            </span>
          </div>

          <div>
            <label class="block text-[11px] text-slate-400 font-mono mb-1">Select Transit Interchange (轉車站):</label>
            <select id="bbi-hub-select" class="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-400">
              <option value="WHC" ${this.currentHub === 'WHC' ? 'selected' : ''}>Western Harbour Crossing Toll Plaza (西區海底隧道)</option>
              <option value="TMTCI" ${this.currentHub === 'TMTCI' ? 'selected' : ''}>Tuen Mun Road Interchange (屯門公路轉車站)</option>
              <option value="TLTI" ${this.currentHub === 'TLTI' ? 'selected' : ''}>Tai Lam Tunnel Interchange (大欖隧道轉車站)</option>
              <option value="CHT" ${this.currentHub === 'CHT' ? 'selected' : ''}>Cross Harbour Tunnel Plaza (紅磡海底隧道收費廣場)</option>
            </select>
          </div>

          <div>
            <div class="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Walking Buffer (Footbridge/Platform):</span>
              <span id="buffer-val" class="text-emerald-400 font-bold">${this.walkBufferSec}s</span>
            </div>
            <input type="range" id="buffer-slider" min="30" max="300" step="15" value="${this.walkBufferSec}" class="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg" />
          </div>
        </div>

        <div id="bbi-cards-list" class="space-y-2.5">
          ${this.renderConnectionCards(connections)}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderConnectionCards(connections) {
    if (!connections || connections.length === 0) {
      return `
        <div class="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono text-center">
          Analyzing live inbound and outbound transfers for ${this.currentHub}...
        </div>
      `;
    }

    return connections.map(c => {
      let badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      let statusIcon = '🟢';
      if (c.probability < 0.5) {
        badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        statusIcon = '🔴';
      } else if (c.probability < 0.8) {
        badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        statusIcon = '🟡';
      }

      return `
        <div class="p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">${c.inboundRoute}</span>
              <span class="text-slate-500 text-xs">➔</span>
              <span class="text-xs font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">${c.outboundRoute}</span>
            </div>
            <span class="text-[11px] font-mono px-2 py-0.5 rounded border ${badgeClass} flex items-center gap-1">
              <span>${statusIcon}</span> ${Math.round(c.probability * 100)}% Catch Prob
            </span>
          </div>

          <div class="flex justify-between items-center text-[11px] font-mono text-slate-400">
            <div>Target Stop: <span class="text-slate-200">${c.platform}</span></div>
            <div>Window: <span class="text-amber-400 font-bold">${c.timeWindowSec}s</span> (Walk: ${this.walkBufferSec}s)</div>
          </div>

          <div class="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-900 pt-1.5">
            <span>Inbound ETA: ${c.inboundEta}</span>
            <span>Outbound ETA: ${c.outboundEta}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  bindEvents() {
    const select = document.getElementById('bbi-hub-select');
    if (select) {
      select.addEventListener('change', (e) => {
        this.currentHub = e.target.value;
        if (this.onHubChange) this.onHubChange(this.currentHub, this.walkBufferSec);
      });
    }

    const slider = document.getElementById('buffer-slider');
    const label = document.getElementById('buffer-val');
    if (slider && label) {
      slider.addEventListener('input', (e) => {
        this.walkBufferSec = parseInt(e.target.value, 10);
        label.textContent = `${this.walkBufferSec}s`;
        if (this.onHubChange) this.onHubChange(this.currentHub, this.walkBufferSec);
      });
    }
  }
}
