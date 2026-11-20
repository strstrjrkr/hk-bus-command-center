/**
 * Ghost Bus & Irregularity Detection Engine
 * Evaluates ETA timestamp drift velocity to identify phantom departures before passengers reach the stop.
 */

/**
 * Drift threshold constant:
 * Gamma = Delta(ETA) / Delta(RealTime)
 * In ideal operation, Gamma == 0 (ETA decrements smoothly with elapsed time).
 * If Gamma >= 1.0, the bus arrival is drifting backward 1 second for every real second passed.
 */
export const DRIFT_VELOCITY_THRESHOLD = 0.85;

/**
 * Evaluates a sequence of polling records for a given route and trip.
 * 
 * @param {Array<{ timestamp: number, etaSec: number, remark: string }>} telemetryHistory
 * @returns {{ isGhost: boolean, driftVelocity: number, confidence: number, diagnosis: string }}
 */
export function detectGhostBusDrift(telemetryHistory) {
  if (!telemetryHistory || telemetryHistory.length < 2) {
    return {
      isGhost: false,
      driftVelocity: 0,
      confidence: 0,
      diagnosis: 'Insufficient telemetry snapshots for drift evaluation.'
    };
  }

  const latest = telemetryHistory[telemetryHistory.length - 1];
  const previous = telemetryHistory[telemetryHistory.length - 2];

  const deltaRealSec = Math.max(1, (latest.timestamp - previous.timestamp) / 1000);
  const deltaEtaSec = latest.etaSec - previous.etaSec;

  // Real-time drift rate: positive values indicate arrival is pushed back
  const driftVelocity = Math.round((deltaEtaSec / deltaRealSec) * 100) / 100;

  // Evaluate heuristic conditions
  const isStalledAtTerminus = (latest.etaSec < 180) && (driftVelocity >= 0.8);
  const hasNoGpsRemark = latest.remark && (
    latest.remark.includes('Scheduled') || 
    latest.remark.includes('預定班次') || 
    latest.remark.includes('原定班次')
  );

  let isGhost = false;
  let confidence = 0;
  let diagnosis = 'Nominal operational status.';

  if (driftVelocity >= 1.5 && hasNoGpsRemark) {
    isGhost = true;
    confidence = 94;
    diagnosis = 'Severe timetable pushback with unassigned vehicle. Probable depot cancellation (收車).';
  } else if (isStalledAtTerminus) {
    isGhost = true;
    confidence = 82;
    diagnosis = 'Departure stalled at terminus past scheduled launch window without active GPS beacon.';
  } else if (driftVelocity >= DRIFT_VELOCITY_THRESHOLD) {
    isGhost = false;
    confidence = 65;
    diagnosis = 'Heavy route-corridor congestion detected upstream. Delay is active rather than canceled.';
  }

  return {
    isGhost,
    driftVelocity,
    confidence,
    diagnosis
  };
}
