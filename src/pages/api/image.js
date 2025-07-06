import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' })

const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

export default async function handler(req, res) {
  const { query } = req.body;
  if (!query) return res. status(400).json({ error: "Missing history title for query" });

  const url = "https://www.googleapis.com/customsearch/v1"

  try {
    const response = await axios.get(url, {
      params: {
        q: query,
        key: GOOGLE_SEARCH_API_KEY,
        cx: SEARCH_ENGINE_ID,
        searchType: 'image',
      },
    });

    const items = response.data.items;
    if (!items || items.length === 0) return res.status(400).json({ error: "No images found" })

    const imageUrl = items[0].link;
    return res.status(200).json({ response: imageUrl })
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}