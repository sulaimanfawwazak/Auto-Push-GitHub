import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  const tableName = 'history_events';

  const { title, content, date, image_url } = req.body;
  
  const { data, error } = await supabase
    .from(tableName)
    .insert([{ 
      title, content, date, image_url 
    }])
    .select();

  console.log({ data, error })

  if (error) {
    return res.status(500).json({ error });
  }

  return res.status(200).json({ data });
}