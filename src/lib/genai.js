import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: './.env' });


async function main() {
  const ai = new GoogleGenAI({});
  const prompt = `Generate 1 "Today in History" for today's date: ${new Date().toLocaleDateString()}, including the title, the description, and the date of the history event (NOT the current date), in this JSON format: {"title": "Event Title (Title Case)", "content": "Event description (4-5 sentences), "date": "YYYY-MM-DD (Date of the history event)"}. Drop all the markdown or any formattings.`

  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt
  })

  const history = response.text;

  console.log(history);
}

await main();
