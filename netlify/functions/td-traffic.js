import { standardHeaders, createSuccessResponse, createErrorResponse } from './utils/responseHelper.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: standardHeaders };
  }

  try {
    const upstreamUrl = 'https://resource.data.one.gov.hk/td/traffic-detectors/tsm.json';
    const res = await fetch(upstreamUrl);

    if (!res.ok) {
      return createErrorResponse(res.status, 'Unable to retrieve TD Traffic Speed Map.');
    }

    const data = await res.json();
    return createSuccessResponse(data, 60);
  } catch (err) {
    return createErrorResponse(500, `Traffic Proxy error: ${err.message}`);
  }
}
