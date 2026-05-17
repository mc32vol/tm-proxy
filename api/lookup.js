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

  try {
    const searchType = type === 'rn' ? 'US_REGISTRATION' : 'US_APPLICATION';
    const url = `https://tsdr.uspto.gov/cgi-bin/tsdr/getTsdrData.pl?importId=${num}&type=${searchType}&action=getStatus&format=json`;

    const tsdrRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://tsdr.uspto.gov/'
      }
    });

    const text = await tsdrRes.text();
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
