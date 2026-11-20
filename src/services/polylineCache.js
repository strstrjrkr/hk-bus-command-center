/**
 * Polyline and Route Geometry Cache Service
 * Persists route stop sequences and GPS polyline vectors to browser localStorage with 7-day TTL.
 */

const CACHE_PREFIX = 'hkbus_poly_v1_';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export class PolylineCache {
  /**
   * Retrieves cached polyline or null if expired
   * @param {string} route 
   * @param {string} direction 'outbound'|'inbound'
   */
  static get(route, direction = 'outbound') {
    const key = `${CACHE_PREFIX}${route.toUpperCase()}_${direction}`;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const record = JSON.parse(raw);
      if (Date.now() - record.savedAt > TTL_MS) {
        localStorage.removeItem(key);
        return null;
      }
      return record.coordinates;
    } catch (err) {
      console.warn('[PolylineCache] Read failed:', err);
      return null;
    }
  }

  /**
   * Saves polyline coordinates with current timestamp
   */
  static set(route, direction, coordinates) {
    const key = `${CACHE_PREFIX}${route.toUpperCase()}_${direction}`;
    try {
      const payload = {
        savedAt: Date.now(),
        coordinates
      };
      localStorage.setItem(key, JSON.stringify(payload));
    } catch (err) {
      console.warn('[PolylineCache] Write failed:', err);
    }
  }

  static clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }
}
