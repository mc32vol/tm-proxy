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
    const query = type === 'rn' 
      ? `registrationNumber:${num}` 
      : `serialNumber:${num}`;
    
    const url = `https://tmsearch.uspto.gov/search/search-results?searchTerm=${encodeURIComponent(query)}&dateRangeField=&startDateFilter=&endDateFilter=&rows=1&start=0&sort=score+desc&searchType=basic`;

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
