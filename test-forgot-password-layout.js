const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Starting browser...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1280,
      height: 800
    }
  });

  try {
    const page = await browser.newPage();
    
    console.log('Navigating to login page...');
    await page.goto('http://localhost:19006/login', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for the login form to be visible
    console.log('Waiting for login form...');
    await page.waitForSelector('input[type="email"]', { visible: true, timeout: 10000 });
    
    // Additional wait to ensure all styles are loaded
    await page.waitForTimeout(2000);
    
    // Take screenshot
    const screenshotPath = path.join(__dirname, 'tasks/verification-artifacts/current-forgot-password-layout.png');
    console.log('Taking screenshot...');
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`Screenshot saved to: ${screenshotPath}`);
    
    // Also take a focused screenshot of just the form area
    const formElement = await page.$('form');
    if (formElement) {
      const focusedPath = path.join(__dirname, 'tasks/verification-artifacts/current-forgot-password-layout-focused.png');
      await formElement.screenshot({ path: focusedPath });
      console.log(`Focused screenshot saved to: ${focusedPath}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();