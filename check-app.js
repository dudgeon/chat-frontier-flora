const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  
  // Collect console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  try {
    console.log('Navigating to localhost:8081...');
    const response = await page.goto('http://localhost:8081', {waitUntil: 'networkidle0', timeout: 30000});
    console.log('Response status:', response.status());
    
    // Wait a bit for any runtime errors
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if page loaded successfully
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for React app mounting
    const appElement = await page.$('#root');
    console.log('App root element found:', !!appElement);
    
    // Check for any visible content
    const bodyContent = await page.evaluate(() => document.body.innerText.substring(0, 200));
    console.log('Body content preview:', bodyContent);
    
    if (errors.length > 0) {
      console.log('Console errors found:');
      errors.forEach(error => console.log('ERROR:', error));
    }
    
  } catch (error) {
    console.log('Failed to load page:', error.message);
  }
  
  await browser.close();
})().catch(console.error);