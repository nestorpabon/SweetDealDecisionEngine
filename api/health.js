// Minimal health check — no imports, no DB, just returns OK
export default function handler(request) {
  return new Response(
    JSON.stringify({
      status: 'ok',
      hasDbUrl: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
