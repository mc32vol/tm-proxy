module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { num, type } = req.query;

  if (!num || !type) {
    return res.status(400).json({ error: 'Missing num or type' });
  }

  const TSDR_KEY = 'xcipuguxayfhzfdstqkijjjldgvpvk';
  const tsdrUrl = `https://tsdrapi.uspto.gov/ts/cd/casestatus/${type}${num}/info.json?USPTO-API-KEY=${TSDR_KEY}`;

  try {
    const tsdrRes = await fetch(tsdrUrl, {
      headers: { 'USPTO-API-KEY': TSDR_KEY, 'Accept': 'application/json' }
    });
    const text = await tsdrRes.text();
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
