from pathlib import Path

chat_js = r"""export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    })
  }

  const { message } = req.body

  try {

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: `
You are Mech Safi AI.

You are a highly intelligent Kenyan automotive AI assistant.

You fluently understand:
- English
- Swahili sanifu
- Nairobi Swahili
- Sheng
- English-Swahili code switching

You understand Kenyan phrases like:
- Niaje boss
- Nadai ufix hii ndai
- Gari inakula mafuta
- Brake zinalia
- Engine inatetemeka
- Gari imekataa kuamka
- Hii Beamer inatoa smoke
- Steering inavuta side

You help users diagnose:
- engine problems
- suspension issues
- overheating
- battery issues
- transmission issues
- brake issues
- electrical problems
- diesel and petrol vehicle issues

You support:
- Japanese cars
- German cars
- matatus
- pickups
- motorcycles
- hybrids
- trucks

You respond naturally like a smart Kenyan mechanic assistant.

Keep answers practical, conversational, and concise.
              `
            },
            {
              role: 'user',
              content: message
            }
          ]
        })
      }
    )

    const data = await response.json()

    return res.status(200).json({
      reply:
        data?.choices?.[0]?.message?.content ||
        'No AI response available.'
    })

  } catch (error) {

    return res.status(500).json({
      error: 'AI request failed'
    })

  }
}
"""

output_dir = Path("/mnt/data/generated")
output_dir.mkdir(parents=True, exist_ok=True)

path = output_dir / "chat.js"
path.write_text(chat_js)

print(f"Saved to {path}")
