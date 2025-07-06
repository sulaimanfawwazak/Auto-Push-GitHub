import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: './.env' })

const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

const filepath = './cat.jpg'

const searchQuery = "Cats"
const url = "https://www.googleapis.com/customsearch/v1"

const response = await axios.get(url, {
  params: {
    q: searchQuery,
    key: GOOGLE_SEARCH_API_KEY,
    cx: SEARCH_ENGINE_ID,
    searchType: 'image',
  },
});

const items = response.data.items;

if (!items || items.length === 0) throw new Error("No image results");

const imageUrl = items[0].link;

const imageRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
const contentType = imageRes.headers['content-type']; // e.g., 'image/jpeg'
const ext = contentType.split('/')[1]; // 'jpeg' or 'png'

fs.writeFileSync(`cat.${ext}`, imageRes.data);

console.log(`Saved at: ${filepath}`);