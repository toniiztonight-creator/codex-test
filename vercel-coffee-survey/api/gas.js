module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  const endpoint = process.env.GAS_WEB_APP_URL;
  if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\//.test(endpoint)) {
    return res.status(503).json({ ok: false, error: 'ยังไม่ได้ตั้งค่า GAS_WEB_APP_URL บน Vercel' });
  }
  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body || {}),
      redirect: 'follow'
    });
    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('Apps Script ตอบกลับในรูปแบบที่ไม่ถูกต้อง'); }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(upstream.ok ? 200 : 502).json(data);
  } catch (error) {
    return res.status(502).json({ ok: false, error: error.message || 'ไม่สามารถเชื่อมต่อ Google Apps Script' });
  }
}
