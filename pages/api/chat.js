// MECH SAFI — AI API Route
// Using Groq (FREE) — powered by Llama 3.3 70B
// Groq API docs: https://console.groq.com

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system, max_tokens = 1000 } = req.body;

  // Check API key exists
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      content: [{ text: '⚠️ GROQ_API_KEY not set. Go to Vercel → Settings → Environment Variables and add it.' }]
    });
  }

  try {
    // Groq uses OpenAI-style format
    // System prompt goes as first message with role "system"
    const groqMessages = [];

    if (system) {
      groqMessages.push({ role: 'system', content: system });
    }

    // Add the conversation messages
    groqMessages.push(...messages);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Best free model on Groq
        max_tokens: max_tokens,
        temperature: 0.7,
        messages: groqMessages
      })
    });

    const data = await response.json();

    // Handle Groq errors
    if (data.error) {
      console.error('Groq error:', data.error);
      return res.status(400).json({
        content: [{ text: `⚠️ AI error: ${data.error.message || 'Unknown error'}` }]
      });
    }

    // Extract the reply text from Groq response
    const text = data.choices?.[0]?.message?.content || '⚠️ No response. Please try again.';

    // Return in same format the frontend expects
    // (keeps all dashboard + WhatsApp code unchanged)
    return res.status(200).json({
      content: [{ text }]
    });

  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({
      content: [{ text: '⚠️ Connection failed. Check your internet and try again.' }]
    });
  }
}

