const memoryStore = globalThis.memoryStore || new Map();
globalThis.memoryStore = memoryStore;

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId required" });
  }

  memoryStore.delete(sessionId);

  return res.status(200).json({
    message: "Session reset successful"
  });
}
