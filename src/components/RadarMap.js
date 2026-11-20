import L from 'leaflet';

export class RadarMap {
  constructor(mapContainerId) {
    this.containerId = mapContainerId;
    this.map = null;
    this.busMarkers = new Map();
    this.routePolyline = null;
  }

  init() {
    const el = document.getElementById(this.containerId);
    if (!el || this.map) return;

    this.map = L.map(this.containerId, {
      center: [22.308, 114.175],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);
    L.control.attribution({ position: 'bottomright' }).addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; CartoDB &copy; OpenStreetMap'
    }).addTo(this.map);

    setTimeout(() => this.map.invalidateSize(), 250);
  }

  renderRoutePolyline(latLngs, color = '#f59e0b') {
    if (this.routePolyline) {
      this.map.removeLayer(this.routePolyline);
    }
    this.routePolyline = L.polyline(latLngs, {
      color: color,
      weight: 4,
      opacity: 0.85,
      dashArray: '8, 4'
    }).addTo(this.map);

    this.map.fitBounds(this.routePolyline.getBounds(), { padding: [40, 40] });
  }

  updateBusPosition(busId, lat, lng, meta = {}) {
    const { route = '968', operator = 'kmb', heading = 0, speed = 0, nextStop = '' } = meta;

    const customIcon = L.divIcon({
      className: 'bus-marker-container',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-md ${operator === 'kmb' ? 'bg-red-600' : 'bg-amber-500'} text-white font-black text-[11px] flex items-center justify-center border-2 border-slate-100 shadow-xl radar-beacon">
            ${route}
          </div>
          <div class="absolute -top-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-white transform origin-bottom" style="transform: rotate(${heading}deg) translateY(-14px);"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    if (this.busMarkers.has(busId)) {
      const marker = this.busMarkers.get(busId);
      marker.setLatLng([lat, lng]);
      marker.setIcon(customIcon);
    } else {
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
      marker.bindPopup(`
        <div class="p-2 font-mono text-slate-900 leading-tight">
          <div class="font-bold text-sm text-amber-600">${operator.toUpperCase()} ${route}</div>
          <div class="text-[11px] text-slate-600 mt-1">Next: ${nextStop || 'En route'}</div>
          <div class="text-[10px] text-slate-500">Speed: ~${speed} km/h (Dead-reckoned)</div>
        </div>
      `);
      this.busMarkers.set(busId, marker);
    }
  }

  clearBuses() {
    this.busMarkers.forEach(m => this.map.removeLayer(m));
    this.busMarkers.clear();
  }
}
