import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  const tableName = 'history_events';

  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "Missing or invalid date format" });
  }

  const targetMD = date.slice(5); // YYYY-MM-DD -> MM-DD
  
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