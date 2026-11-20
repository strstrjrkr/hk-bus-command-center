export const standardHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

export function createSuccessResponse(data, cacheSeconds = 15) {
  return {
    statusCode: 200,
    headers: {
      ...standardHeaders,
      'Cache-Control': `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`
    },
    body: JSON.stringify(data)
  };
}

export function createErrorResponse(statusCode, message) {
  return {
    statusCode,
    headers: standardHeaders,
    body: JSON.stringify({ error: message })
  };
}
