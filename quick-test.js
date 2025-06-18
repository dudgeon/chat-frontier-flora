const puppeteer = require('puppeteer-core');

async function quickTest() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    console.log('Testing http://localhost:8081/...');
    await page.goto('http://localhost:8081/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    const title = await page.title();
    console.log('✅ Page loaded, title:', title);
    
    // Check if bundle loads
    await page.waitForSelector('#root', { timeout: 5000 });
    console.log('✅ Root element found');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

quickTest();