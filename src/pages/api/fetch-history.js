import { supabase } from "@/lib/supabase";
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export default async function handler(req, res) {
  const tableName = 'history_events';
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const { date } = req.query;

  console.log("date:", date);

  // Added this to ensure the date format is correct using GenAI
  const prompt = `Correct this date: ${date} to YYYY-MM-DD format if it's invalid. If it's already valid, return it unchanged. Respond ONLY with the corrected date string.`
  
  let correctDate;
  try {
    const date_response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt
    })

    correctDate = date_response.text;
    correctDate = correctDate.trim();

    console.log("correctDate:", correctDate);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(correctDate)) {
      return res.status(400).json({ error: "Missing or invalid date format" });
    }
  }
  catch (error) {
    return res.status(500).json({ error: "Gemini error: " + error.message });
  }

  const targetMD = correctDate.slice(5); // YYYY-MM-DD -> MM-DD
  
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1000);

    if (error) return res.status(500).json({ error });

    const match = data.find(entry => {
      const entryMD = entry.date.slice(5);
      return entryMD === targetMD;
    });

    if (!match) return res.status(404).json({ message: "No match for this MM-DD" });

    return res.status(200).json({ data: match });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}