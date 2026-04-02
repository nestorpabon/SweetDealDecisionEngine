// Vercel API handler at root level for Vite projects

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  console.log(`[API] ${method} ${path}`);

  // CORS
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Health
  if (path === '/api/health') {
    return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
  }

  // Test endpoint
  if (path === '/api/test') {
    return jsonResponse({ message: 'API working!', path });
  }

  // All API endpoints return empty data for now
  if (path.startsWith('/api/')) {
    return jsonResponse({ data: [] });
  }

  return jsonResponse({ error: 'Not found', path }, 404);
}
