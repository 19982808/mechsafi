const memoryStore = globalThis.memoryStore || new Map();
globalThis.memoryStore = memoryStore;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history = [], sessionId } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "Missing GROQ_API_KEY" });
  }

  // 🔥 Create or reuse session memory
  const sid = sessionId || "default_session";

  if (!memoryStore.has(sid)) {
    memoryStore.set(sid, []);
  }

  const previousMemory = memoryStore.get(sid);

  try {
    const messages = [
      {
        role: "system",
        content: `You are Kamau, a Nairobi mechanic running a garage in Westlands.
You remember past conversations naturally like a human mechanic.

Be practical, honest, and conversational in Kenyan English/Swahili/Sheng mix.

Never mention you are AI.`
      },
      ...previousMemory,
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: message }
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.8,
          max_tokens: 500,
          messages
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq error:", data);
      return res.status(500).json({ error: "Groq request failed" });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ error: "Empty AI response" });
    }

    // 🔥 Save memory (keep last 10 messages only)
    const updatedMemory = [
      ...previousMemory,
      { role: "user", content: message },
      { role: "assistant", content: reply }
    ].slice(-10);

    memoryStore.set(sid, updatedMemory);

    return res.status(200).json({
      reply,
      sessionId: sid
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
