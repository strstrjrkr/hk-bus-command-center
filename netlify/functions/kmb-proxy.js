import { standardHeaders, createSuccessResponse, createErrorResponse } from './utils/responseHelper.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: standardHeaders };
  }

  const { path } = event;
  const parts = path.split('/').filter(Boolean);
  const route = event.queryStringParameters?.route || parts[parts.length - 1];

  if (!route) {
    return createErrorResponse(400, 'Missing bus route parameter.');
  }

  try {
    const upstreamUrl = `https://data.etabus.gov.hk/v1/transport/kmb/route-eta/${encodeURIComponent(route)}/1`;
    const res = await fetch(upstreamUrl);

    if (!res.ok) {
      return createErrorResponse(res.status, `Upstream KMB API returned status ${res.status}`);
    }

    const data = await res.json();
    return createSuccessResponse(data, 15);
  } catch (err) {
    return createErrorResponse(500, `Internal proxy failure: ${err.message}`);
  }
}
