export class TunnelBenchmarkPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(tunnelData = []) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="space-y-4">
        <div class="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🛣️</span> Cross-Harbour Speed vs MTR
            </h2>
            <span class="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
              TD TSM FEED
            </span>
          </div>
          <p class="text-xs text-slate-400">
            Real-time highway detector speed panels combined with bus ETA to evaluate MTR parity.
          </p>
        </div>

        <div class="space-y-2.5">
          ${this.renderCards(tunnelData)}
        </div>
      </div>
    `;
  }

  renderCards(data) {
    if (!data || data.length === 0) {
      return `
        <div class="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono text-center">
          Querying TD speed map detectors and MTR journey time tables...
        </div>
      `;
    }

    return data.map(item => {
      const isBusFaster = item.diffMinutes >= 0;
      return `
        <div class="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-2.5">
          <div class="flex justify-between items-start">
            <div>
              <div class="text-xs font-black text-slate-100 flex items-center gap-2">
                <span>${item.tunnelNameEn}</span>
                <span class="text-[11px] text-slate-400 font-normal">(${item.tunnelNameZh})</span>
              </div>
              <div class="text-[11px] font-mono text-slate-400 mt-0.5">
                ${item.sampleBusRoute} vs ${item.mtrLine}
              </div>
            </div>
            <div class="text-right font-mono">
              <div class="text-xs font-black ${isBusFaster ? 'text-emerald-400' : 'text-rose-400'}">
                ${isBusFaster ? `Bus +${item.diffMinutes}m Faster` : `MTR +${Math.abs(item.diffMinutes)}m Faster`}
              </div>
              <div class="text-[10px] text-slate-500">Confidence: ${item.confidence}%</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900/60 p-2 rounded border border-slate-800/80">
            <div>
              <span class="text-slate-500">Live Speed:</span>
              <span class="font-bold ${item.avgSpeedKmH > 45 ? 'text-emerald-400' : 'text-amber-400'}">
                ${item.avgSpeedKmH} km/h
              </span>
            </div>
            <div>
              <span class="text-slate-500">Tunnel Queue:</span>
              <span class="text-slate-200">${item.congestionLevel}</span>
            </div>
            <div>
              <span class="text-slate-500">Bus Est. Trip:</span>
              <span class="text-slate-200 font-bold">${item.busTripMinutes} mins</span>
            </div>
            <div>
              <span class="text-slate-500">MTR Est. Trip:</span>
              <span class="text-slate-200 font-bold">${item.mtrTripMinutes} mins</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}
