/**
 * Probability-of-Catch (BBI) Engine
 * Models transfer success using a standard Normal Cumulative Distribution Function (CDF).
 */

/**
 * Standard Normal Error Function (erf) approximation (Abramowitz and Stegun).
 */
function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

/**
 * Computes standard normal cumulative distribution function Phi(z).
 */
export function normalCdf(mean, sigma, x) {
  if (sigma <= 0) return x >= mean ? 1.0 : 0.0;
  return 0.5 * (1.0 + erf((x - mean) / (sigma * Math.sqrt(2))));
}

/**
 * Calculates connection catch probability for a BBI interchange transfer.
 * 
 * Let Delta = T_outbound - (T_inbound + T_walk)
 * Standard deviation sigma accounts for traffic variance and passenger walking pace.
 *
 * @param {number} tInboundSec Inbound bus arrival seconds from now
 * @param {number} tOutboundSec Outbound connecting bus arrival seconds from now
 * @param {number} walkBufferSec Nominal walking and boarding buffer in seconds
 * @param {number} varianceSec Expected standard deviation in arrival timing (default 45s)
 * @returns {{ probability: number, marginSec: number, status: 'safe'|'tight'|'critical'|'missed' }}
 */
export function evaluateCatchProbability(tInboundSec, tOutboundSec, walkBufferSec = 90, varianceSec = 45) {
  const availableMargin = tOutboundSec - (tInboundSec + walkBufferSec);
  
  // Probability that availableMargin >= 0 given Gaussian uncertainty
  const probability = normalCdf(availableMargin, varianceSec, 0);

  let status = 'safe';
  if (probability < 0.2) {
    status = 'missed';
  } else if (probability < 0.6) {
    status = 'critical';
  } else if (probability < 0.85) {
    status = 'tight';
  }

  return {
    probability: Math.round(probability * 100) / 100,
    marginSec: Math.round(availableMargin),
    status
  };
}
