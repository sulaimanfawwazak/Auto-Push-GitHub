import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export default async function handler(req, res) {
  try {
    // const baseUrl = 'http://localhost:3000'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 1. Check GitHub contributions
    const contribRes = await fetch(`${baseUrl}/api/check-contributions`);
    const { contributions } = await contribRes.json();

    if (contributions > 0) {
      return res.status(200).json({ message: "You already have contributions today!" });
    }

    // 2. Generate "Today in History" if there's no contribution
    const genAIRes = await fetch(`${baseUrl}/api/genai`);
    const genAIData = await genAIRes.json();

    // `genAIData` example:
    //    "title": "First Successful Human-Powered Flight",
    //    "content": "On this day, Orville Wright piloted the Wright Flyer I, making the first successful self-propelled sustained flight.  The flight lasted just 12 seconds, covering a distance of 120 feet at Kitty Hawk, North Carolina.  This groundbreaking achievement marked a pivotal moment in aviation history, paving the way for future advancements in flight technology and air travel.  It forever changed how humanity interacted with the world.",
    //    "date": "1903-12-17"

    const history = genAIData.response || genAIData.raw;
    const title = history.title;

    if (!title) {
      return res.status(400).json({ error: "Could not extract title from GenAI response" });
    }

    console.log(title);

    // 3. Search image using the title
    const imageRes = await fetch(`${baseUrl}/api/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: title }),
    });

    const imageData = await imageRes.json();
    const imageUrl = imageData.response;
    console.log(imageUrl);

    // 4. Add the data to database
    const addToDatabase = await fetch(`${baseUrl}/api/save-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: history.title,
        content: history.content,
        date: history.date,
        image_url: imageUrl,
      }),
    });
    const saveRes = await addToDatabase.json();
    const saveData = saveRes.data;


    return res.status(200).json({
      message: "Generated new history due to no contributions in GitHub",
      data: saveData || null,
    });

    // Example:
    //    "title": "First Successful Human-Powered Flight",
    //    "content": "On this day, Orville Wright piloted the Wright Flyer I, making the first successful self-propelled sustained flight.  The flight lasted just 12 seconds, covering a distance of 120 feet at Kitty Hawk, North Carolina.  This groundbreaking achievement marked a pivotal moment in aviation history, paving the way for future advancements in flight technology and air travel.  It forever changed how humanity interacted with the world.",
    //    "date": "1903-12-17"
    //    "image_url": "https://...."

  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}