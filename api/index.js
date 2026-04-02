// Minimal test handler - no external dependencies
export default async function handler(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Simple JSON response helper
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  // Test endpoints
  if (pathname === '/api/test') {
    return json({ ok: true, message: 'API is working!' });
  }

  if (pathname === '/api/health') {
    return json({ status: 'healthy' });
  }

  // Default - return empty data
  if (pathname.startsWith('/api/')) {
    return json({ data: [] });
  }

  return json({ error: 'Not found' }, 404);
}
