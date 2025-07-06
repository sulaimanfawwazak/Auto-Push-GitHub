const { chromium } = require('playwright');
const { DateTime } = require('luxon');

async function checkTodaysContribution(username) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to user's GitHub profile
    console.log("Visiting GitHub's page");
    await page.goto(`https://www.github.com/${username}`);

    // Wait for the contribution graph to load
    console.log("Waiting for ControbutionCalendar selector");
    await page.waitForSelector('.ContributionCalendar-day');

    // Get today's date in YYYY-MM-DD format (same as GitHub uses)
    console.log("Getting today's day");
    const today = DateTime.now().toFormat('yyyy-MM-dd');
    console.log(today);

    // Find today's contribution cell
    console.log("Finding today's contribution cell");
    const todaysCell = await page.$(`.ContributionCalendar-day[data-date="${today}"]`);

    if (!todaysCell) {
      throw new Error('Could not find today\'s contribution cell');
    }

    // Get the `data-level` attribute value
    const contributionLevel = await todaysCell.getAttribute('data-level');

    return {
      date: today,
      contributionLevel: parseInt(contributionLevel),
      hasContribution: parseInt(contributionLevel) > 0
    };
  }
  catch (error) {
    throw new Error(`Error happened: ${error}`);
  }
  finally {
    await browser.close();
  }
}

// Usage example
(async () => {
  const result = await checkTodaysContribution('sulaimanfawwazak');
  console.log(result);

  if (!result.hasContribution) {
    console.log('No contribution today! Time ot make a commit.');
  }
})();