export class GhostBusPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(incidents = []) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="space-y-4">
        <div class="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🚨</span> Ghost Bus (收車) Sentinel
            </h2>
            <span class="text-[10px] font-mono bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
              DRIFT DETECTOR
            </span>
          </div>
          <p class="text-xs text-slate-400">
            Monitors ETA timestamp drift ($\gamma = \Delta \text{ETA} / \Delta t$). Trips drifting $\ge 1.0$ s/s indicate phantom or canceled departures.
          </p>
        </div>

        <div class="space-y-2.5">
          ${this.renderIncidents(incidents)}
        </div>
      </div>
    `;
  }

  renderIncidents(incidents) {
    if (!incidents || incidents.length === 0) {
      return `
        <div class="p-4 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-emerald-400 font-mono text-center flex items-center justify-center gap-2">
          <span>🛡️</span> All monitored routes reporting active GPS sync. Zero phantom departures detected.
        </div>
      `;
    }

    return incidents.map(inc => {
      return `
        <div class="p-3.5 bg-rose-950/20 border border-rose-900/50 rounded-lg space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black px-1.5 py-0.5 rounded bg-rose-500 text-slate-950 font-mono">
                ${inc.route}
              </span>
              <span class="text-xs font-bold text-slate-200">${inc.terminus}</span>
            </div>
            <span class="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-mono font-bold">
              DRIFT: +${inc.driftRate}s/s
            </span>
          </div>

          <p class="text-xs text-slate-300 leading-relaxed">
            ${inc.reason}
          </p>

          <div class="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-rose-900/30 pt-1.5">
            <span>Scheduled: ${inc.scheduledTime}</span>
            <span>Telemetry Mode: ${inc.apiRemark || 'No GPS Handshake'}</span>
          </div>
        </div>
      `;
    }).join('');
  }
}
