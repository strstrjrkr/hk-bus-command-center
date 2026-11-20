import { standardHeaders, createSuccessResponse, createErrorResponse } from './utils/responseHelper.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: standardHeaders };
  }

  const { path } = event;
  const parts = path.split('/').filter(Boolean);
  const companyId = event.queryStringParameters?.companyId || 'CTB';
  const route = event.queryStringParameters?.route || parts[parts.length - 1];

  if (!route) {
    return createErrorResponse(400, 'Missing Citybus route parameter.');
  }

  try {
    const upstreamUrl = `https://rt.data.gov.hk/v2/transport/citybus/eta/${encodeURIComponent(companyId)}/${encodeURIComponent(route)}`;
    const res = await fetch(upstreamUrl);

    if (!res.ok) {
      return createErrorResponse(res.status, `Upstream Citybus API returned status ${res.status}`);
    }

    const data = await res.json();
    return createSuccessResponse(data, 15);
  } catch (err) {
    return createErrorResponse(500, `Internal proxy failure: ${err.message}`);
  }
}
