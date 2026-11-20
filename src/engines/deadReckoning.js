/**
 * Dead-Reckoning Position Engine
 * Solves real-time bus location between Stop N and Stop N+1 using ETA gradients along polyline segments.
 */

/**
 * Calculates geodesic distance between two coordinates using the Haversine formula (km).
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's mean radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates compass bearing (heading in degrees [0, 360]) from point A to point B.
 */
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x =
    Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
    Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
  const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  return Math.round(bearing);
}

/**
 * Interpolates vehicle position along an ordered road polyline between Stop N and Stop N+1.
 * 
 * @param {Array<[number, number]>} segmentPolyline Array of [lat, lng] representing the road segment
 * @param {number} tRemainingSec Time remaining until Stop N+1 in seconds
 * @param {number} tScheduledSec Nominal travel duration between Stop N and Stop N+1 in seconds
 * @returns {{ lat: number, lng: number, heading: number, progressRatio: number }}
 */
export function interpolatePositionOnSegment(segmentPolyline, tRemainingSec, tScheduledSec) {
  if (!segmentPolyline || segmentPolyline.length === 0) {
    return { lat: 22.3193, lng: 114.1694, heading: 0, progressRatio: 0 };
  }

  if (segmentPolyline.length === 1) {
    return { lat: segmentPolyline[0][0], lng: segmentPolyline[0][1], heading: 0, progressRatio: 1 };
  }

  // Progress fraction lambda in range [0.0, 1.0]
  const scheduled = Math.max(tScheduledSec, 30);
  const elapsed = Math.max(0, scheduled - Math.max(0, tRemainingSec));
  const lambda = Math.min(Math.max(elapsed / scheduled, 0.0), 1.0);

  // Measure cumulative segment distances
  const distances = [];
  let totalDistance = 0;
  for (let i = 0; i < segmentPolyline.length - 1; i++) {
    const d = haversineDistance(
      segmentPolyline[i][0], segmentPolyline[i][1],
      segmentPolyline[i + 1][0], segmentPolyline[i + 1][1]
    );
    distances.push(d);
    totalDistance += d;
  }

  if (totalDistance === 0) {
    return { lat: segmentPolyline[0][0], lng: segmentPolyline[0][1], heading: 0, progressRatio: lambda };
  }

  const targetDist = lambda * totalDistance;
  let accumulated = 0;

  for (let i = 0; i < distances.length; i++) {
    const nextAccum = accumulated + distances[i];
    if (nextAccum >= targetDist || i === distances.length - 1) {
      const subRatio = distances[i] === 0 ? 0 : (targetDist - accumulated) / distances[i];
      const p1 = segmentPolyline[i];
      const p2 = segmentPolyline[i + 1];

      const lat = p1[0] + (p2[0] - p1[0]) * subRatio;
      const lng = p1[1] + (p2[1] - p1[1]) * subRatio;
      const heading = calculateBearing(p1[0], p1[1], p2[0], p2[1]);

      return { lat, lng, heading, progressRatio: lambda };
    }
    accumulated = nextAccum;
  }

  const lastPoint = segmentPolyline[segmentPolyline.length - 1];
  return { lat: lastPoint[0], lng: lastPoint[1], heading: 0, progressRatio: 1.0 };
}
