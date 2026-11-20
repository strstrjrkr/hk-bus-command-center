export class NavigationBar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.clockInterval = null;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-sm shadow-inner">
          HK
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xs sm:text-sm font-black tracking-tight text-slate-100 uppercase">
              HK Bus Command Center
            </h1>
            <span class="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
              SYS-OK
            </span>
          </div>
          <p class="text-[11px] text-slate-400 hidden sm:block">Dead-Reckoning Radar & BBI Transfer Matrix</p>
        </div>
      </div>

      <div class="flex items-center gap-3 text-xs font-mono">
        <div class="hidden md:flex items-center gap-1.5 text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span id="nav-telemetry-status">DATA.GOV.HK • 15s SYNC</span>
        </div>
        <div id="nav-live-clock" class="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-amber-400 font-bold">
          --:--:-- HKT
        </div>
      </div>
    `;

    this.startClock();
  }

  startClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    const update = () => {
      const clockEl = document.getElementById('nav-live-clock');
      if (clockEl) {
        clockEl.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Hong_Kong' }) + ' HKT';
      }
    };
    update();
    this.clockInterval = setInterval(update, 1000);
  }

  updateApiStatus(statusText, isOnline = true) {
    const el = document.getElementById('nav-telemetry-status');
    if (!el) return;
    el.innerHTML = `
      <span class="inline-block w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse"></span>
      <span>${statusText}</span>
    `;
  }
}
