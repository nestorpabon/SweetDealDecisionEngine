// Sweet Deal Decision Engine — Vercel API Routes
// Minimal test implementation to verify function is working

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.pathname;

  console.log('🔍 API Handler called');
  console.log('   URL:', req.url);
  console.log('   Path:', path);
  console.log('   Method:', req.method);

  // Super simple test endpoint
  if (path === '/api/test' || path === '/test') {
    return jsonResponse({ message: 'API is working!', timestamp: new Date().toISOString(), receivedPath: path });
  }

  if (path === '/api/health' || path === '/health') {
    return jsonResponse({ status: 'ok' });
  }

  // Frontend request - just return empty data for now
  if (path.startsWith('/api/') || path === '/') {
    return jsonResponse({ data: [] });
  }

  return jsonResponse({ error: 'Not found', path }, 404);
}
