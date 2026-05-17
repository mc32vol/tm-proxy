export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const { searchParams } = new URL(req.url);
  const num = searchParams.get('num');
  const type = searchParams.get('type');

  if (!num || !type) {
    return new Response(JSON.stringify({ error: 'Missing num or type param' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const TSDR_KEY = 'xcipuguxayfhzfdstqkijjjldgvpvk';
  const tsdrUrl = `https://tsdrapi.uspto.gov/ts/cd/casestatus/${type}${num}/info.json`;

  try {
    const tsdrRes = await fetch(tsdrUrl, {
      headers: {
        'USPTO-API-KEY': TSDR_KEY,
        'Accept': 'application/json',
      },
    });

    if (!tsdrRes.ok) {
      const errText = await tsdrRes.text();
      return new Response(JSON.stringify({ error: `TSDR error ${tsdrRes.status}`, detail: errText }), {
        status: tsdrRes.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const data = await tsdrRes.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 's-maxage=3600',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Proxy fetch failed', detail: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
