export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // For now, just log the contact (you could integrate with email service, Airtable, etc.)
    console.log('New contact submission:', { name, email, phone, message, timestamp: new Date().toISOString() });

    // Return success
    return res.status(201).json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      id: Date.now().toString()
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
