const axios = require('axios');
require('dotenv').config({ path: './.env' });

export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_PAT_CLASSIC;
  const USERNAME = 'sulaimanfawwazak';

  const today = new Date().toISOString().split('T')[0]; //'2025-07-06T07:25:11.839Z' -> '2025-07-06
  
  const query = `
    query {
      user(login: "${USERNAME}") {
        contributionsCollection(from: "${today}T00:00:00Z", to: "${today}T23:00:00Z") {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://api.github.com/graphql', 
      { query },
      { headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }}
    );
    
    const contributions = response
    .data
    .data
    .user
    .contributionsCollection
    .contributionCalendar
    .totalContributions;

    if (contributions === 0) {
      console.log("No contributions today!");
    }

    return res.status(200).json({ contributions });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}