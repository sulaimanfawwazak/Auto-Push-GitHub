import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import moment from 'moment';

dotenv.config({ path: './.env' });


async function main() {
  const ai = new GoogleGenAI({});
  const now = moment().format('MMMM Do'); // June 19th, July 13th, etc.
  const month = now.split(' ')[0];
  const day = now.split(' ')[1];
  const month_number = new Date().toISOString().split('-')[1];
  // const now = 'June 19th';
  // const prompt = `Generate 1 "Today in History" for today's date: ${new Date().toLocaleDateString()}, including the title, the description, and the date of the history event (NOT the current date), in this JSON format: {"title": "Event Title (Title Case)", "content": "Event description (4-5 sentences), "date": "YYYY-MM-DD (Date of the history event)"}. Drop all the markdown or any formattings.`
  // const prompt = `Generate 1 "Today in History" for this date in any year: ${now}, including the title, the description, and the date of the history event (NOT the current date), in this JSON format: {"title": "Event Title (Title Case)", "content": "Event description (4-5 sentences), "date": "YYYY-MM-DD (Date of the history event)"}. Drop all the markdown or any formattings.`

  const prompt = `
You are a highly accurate historical fact retrieval system. Your sole purpose is to generate EXACTLY 1 verified "Today in History" that MUST have occurred on ${day} of ${month} in any year. Do NOT select events from other days or months, even if they are historically significant. The event can be from any topic or field (e.g., sport, war, politics, religion, art, economic, science, discovery, culture, etc.).

- The output MUST be in raw JSON format with no markdown, backticks, or any other formatting characters outside of the JSON structure itself, and MUST strictly follow this structure:

{
  "title": "Event Title (in Title Case)",
  "content": "Brief but informative event summary in 4-5 sentences. Include relevant context such as location, key figures involved, or immediate impact. Focus on clarity and conciseness.",
  "date": "YYYY-MM-DD" // This is the exact calendar date (year-month-day) when the event occurred.
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  })

  const history = response.text;

  console.log(now);
  console.log(`${day} of ${month}`);
  console.log(history);
}

await main();
