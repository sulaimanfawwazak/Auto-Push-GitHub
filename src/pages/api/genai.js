import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: './.env' });

export default async function handler(req, res) {
  const now = new Date();

  const dateStr = now.toISOString().split('T')[0];
  let day = now.getDate();
  let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][now.getMonth()];

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  
  const prompt = `
You are a highly accurate historical fact retrieval system. Your sole purpose is to generate EXACTLY 1 verified "Today in History" that MUST have occurred on ${day} of ${month} in any year. Do NOT select events from other days or months, even if they are historically significant. The event can be from any topic or field (e.g., sport, war, politics, religion, art, economic, science, discovery, culture, etc.).

- The output MUST be in raw JSON format with no markdown, backticks, or any other formatting characters outside of the JSON structure itself, and MUST strictly follow this structure:

{
  "title": "Event Title (in Title Case)",
  "content": "Brief but informative event summary in 4-5 sentences. Include relevant context such as location, key figures involved, or immediate impact. Focus on clarity and conciseness.",
  "date": "YYYY-MM-DD" // This is the exact calendar date (year-month-day) when the event occurred.
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt
    });

    const result = response.text;
    const cleaned = result
      .trim()
      .replace(/^```json\s*/i, '') // remove leading ```json
      .replace(/^```\s*/i, '')     // just in case it uses ``` without "json"
      .replace(/\s*```$/, '');     // remove trailing ```

    try {
      const json = JSON.parse(cleaned);
      return res.status(200).json({ response: json });
    }
    catch (e) {
      return res.status(200).json( { raw: result, error: `Could not parse JSON even after clean up` })
    }
    
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
