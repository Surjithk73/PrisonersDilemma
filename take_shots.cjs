const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  // 1. Home
  console.log('Navigating to Home...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'report_assets/real_home.png', fullPage: false });
  console.log('Saved real_home.png');

  // 2. Game
  console.log('Navigating to Game...');
  await page.goto('http://localhost:5173/game', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'report_assets/real_game.png', fullPage: true });
  console.log('Saved real_game.png');

  // 3. Report
  console.log('Navigating to Report...');
  await page.goto('http://localhost:5173/report/1', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'report_assets/real_report.png', fullPage: true });
  console.log('Saved real_report.png');

  // 4. Sessions
  console.log('Navigating to Sessions...');
  await page.goto('http://localhost:5173/sessions', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'report_assets/real_sessions.png', fullPage: true });
  console.log('Saved real_sessions.png');

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
})().catch(err => {
  console.error('Error taking screenshots:', err);
  process.exit(1);
});
