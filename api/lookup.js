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
    const field = type === 'rn' ? 'registration_number' : 'serial_number';
    const url = `https://markbase.co/api/v1/trademarks?${field}=${num}`;

    const response = await fetch(url, {
      headers: { 
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const text = await response.text();
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
