const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Generating PDF from ASSIGNMENT_2_PROGRESS_REPORT.html...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.resolve(__dirname, 'ASSIGNMENT_2_PROGRESS_REPORT.html').replace(/\\/g, '/');
  console.log('Loading HTML file:', filePath);

  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Generate high-quality print PDF
  await page.pdf({
    path: path.resolve(__dirname, 'ASSIGNMENT_2_PROGRESS_REPORT.pdf'),
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '0.6in',
      right: '0.7in',
      bottom: '0.6in',
      left: '0.7in'
    }
  });

  await browser.close();
  console.log('PDF generated successfully at ASSIGNMENT_2_PROGRESS_REPORT.pdf');
})().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
