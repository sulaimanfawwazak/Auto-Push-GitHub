const axios = require('axios');
require('dotenv').config({ path: './.env' });

const GITHUB_TOKEN = process.env.GITHUB_PAT_CLASSIC;
const USERNAME = 'sulaimanfawwazak';

const today = new Date().toISOString();

const query = `
  query {
    user(login: "${USERNAME}") {
      contributionsCollection(from: "${today}", to: "${today}") {
        contributionCalendar {
          totalContributions
        }
      }
    }
  }
`;

const query2 = `
  query {
    user(login: "${USERNAME}") {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`

axios.post('https://api.github.com/graphql', { query }, {
  headers: {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
  }
}).then(response => {
  const contributions = response  
    .data
    .data
    .user
    .contributionsCollection
    .contributionCalendar
    .totalContributions;
  console.log(`Today's total contributions: ${contributions}`);
});

axios.post('https://api.github.com/graphql', { query2 }, {
  headers: {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
  }
}).then(response => {
  const weeks = response  
    .data
    .data
    .user
    .contributionsCollection
    .contributionCalendar
    .weeks;
  console.log(`Weeks: ${weeks}`);
  const allDays = weeks.flatMap(week => week.contributionDays);
  const todayStr = new Date().toISOString.split('T')[0];
  const todayContrib = allDays.find(day => day.date === todayStr);
  const contributions = todayContrib ? todayContrib.contributionCount : 0;
  console.log(`Today's total contributions: ${contributions}`);
});
