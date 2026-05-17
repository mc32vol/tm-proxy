module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { num, type } = req.query;
  return res.status(200).json({ 
    message: 'Proxy is working!', 
    num: num, 
    type: type 
  });
};
