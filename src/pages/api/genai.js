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
  const prompt = `Using only verifiable historical records, generate one "Today in History" event that occurred on this day in any year. Today's date in the form of YYYY-MM-DD is: ${dateStr}. Output only raw JSON (no markdown, backticks, or explanations) with the format: {"title": "Event Title (Title Case)", "content": "Event description (4-5 factual sentences)", "date": "YYYY-MM-DD (Date of the historical event)"}. Do NOT use today’s date as the event date. Ensure all facts are accurate and consistent with historical sources.`

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
