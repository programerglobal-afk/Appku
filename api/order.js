// API Order untuk Traffic Service
// Koneksi dengan SMM Panel API

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, link, service, quantity } = req.body;

    // API Key dari Environment Variable Vercel
    const API_KEY = process.env.SMM_API_KEY;
    const API_URL = process.env.SMM_API_URL || 'https://smmpanel.com/api/v2';

    if (!API_KEY) {
      return res.status(500).json({ 
        error: 'API Key tidak ditemukan',
        message: 'Silahkan set SMM_API_KEY di environment variables Vercel'
      });
    }

    // Action: create order
    if (action === 'order') {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: API_KEY,
          action: 'add',
          service: service,
          link: link,
          quantity: quantity
        })
      });

      const data = await response.json();

      if (data.error) {
        return res.status(400).json({
          success: false,
          error: data.error
        });
      }

      return res.status(200).json({
        success: true,
        order_id: data.order,
        message: 'Order berhasil dibuat'
      });
    }

    // Action: check status
    if (action === 'status') {
      const { order_id } = req.body;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: API_KEY,
          action: 'status',
          order: order_id
        })
      });

      const data = await response.json();

      return res.status(200).json({
        success: true,
        status: data.status, // pending, processing, completed, partial, canceled
        start_count: data.start_count,
        remains: data.remains,
        charge: data.charge
      });
    }

    // Action: get services list
    if (action === 'services') {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: API_KEY,
          action: 'services'
        })
      });

      const data = await response.json();

      return res.status(200).json({
        success: true,
        services: data
      });
    }

    // Action: get balance
    if (action === 'balance') {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: API_KEY,
          action: 'balance'
        })
      });

      const data = await response.json();

      return res.status(200).json({
        success: true,
        balance: data.balance,
        currency: data.currency
      });
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Contoh penggunaan dari frontend:
/*
// Create order
fetch('/api/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'order',
    service: '1', // ID service dari SMM Panel
    link: 'https://www.tiktok.com/@user/video/123',
    quantity: 1000
  })
})

// Check status
fetch('/api/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'status',
    order_id: '12345'
  })
})

// Get services
fetch('/api/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'services'
  })
})

// Get balance
fetch('/api/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'balance'
  })
})
*/
