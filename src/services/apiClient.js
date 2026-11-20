/**
 * Unified API Client for Hong Kong Transit Endpoints
 * Communicates with /.netlify/functions proxies for KMB, CTB, and TD feeds.
 */

const BASE_URL = window.location.hostname === 'localhost' && window.location.port === '5173'
  ? 'http://localhost:8888/api'
  : '/api';

export class ApiClient {
  /**
   * Fetches real-time ETA for a KMB route
   * @param {string} route e.g. "968"
   * @param {number} serviceType 1 for normal, 2+ for special departures
   */
  static async getKmbRouteEta(route, serviceType = 1) {
    try {
      const res = await fetch(`${BASE_URL}/kmb/route-eta?route=${encodeURIComponent(route)}&serviceType=${serviceType}`);
      if (!res.ok) throw new Error(`KMB Proxy failed with HTTP ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error('[ApiClient] Error fetching KMB ETA:', err);
      return [];
    }
  }

  /**
   * Fetches real-time ETA for Citybus
   * @param {string} companyId "CTB"
   * @param {string} route e.g. "930X"
   */
  static async getCtbRouteEta(companyId, route) {
    try {
      const res = await fetch(`${BASE_URL}/ctb/route-eta?companyId=${companyId}&route=${encodeURIComponent(route)}`);
      if (!res.ok) throw new Error(`CTB Proxy failed with HTTP ${res.status}`);
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.error('[ApiClient] Error fetching CTB ETA:', err);
      return [];
    }
  }

  /**
   * Fetches Transport Department Traffic Speed Map (TSM) sensor records
   */
  static async getTdTrafficSpeedMap() {
    try {
      const res = await fetch(`${BASE_URL}/td/tsm`);
      if (!res.ok) throw new Error(`TD Proxy failed with HTTP ${res.status}`);
      const json = await res.json();
      return json.tsm || [];
    } catch (err) {
      console.error('[ApiClient] Error fetching TD TSM:', err);
      return [];
    }
  }
}
