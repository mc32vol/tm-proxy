export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const { searchParams } = new URL(req.url);
  const num = searchParams.get('num');
  const type = searchParams.get('type');

  if (!num || !type) {
    return new Response(JSON.stringify({ error: 'Missing num or type' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const TSDR_KEY = 'xcipuguxayfhzfdstqkijjjldgvpvk';
  const tsdrUrl = `https://tsdrapi.uspto.gov/ts/cd/casestatus/${type}${num}/info.json`;

  try {
    const tsdrRes = await fetch(tsdrUrl, {
      headers: { 'USPTO-API-KEY': TSDR_KEY, 'Accept': 'application/json' }
    });
    const text = await tsdrRes.text();
    return new Response(text, {
      status: tsdrRes.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export const config = { runtime: 'edge' };
