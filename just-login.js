#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function justLogin() {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-first-run']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Just logging in...');
    
    // Go to login page
    await page.goto('http://localhost:19006/login');
    await page.waitForSelector('input[type="email"]');
    
    // Fill login form
    await page.type('input[type="email"]', 'dudgeon+floratest@gmail.com');
    await page.type('input[type="password"]', 'intended*focus3CRAVEN');
    
    // Click sign in
    await page.click('[data-testid="submit-button"]');
    
    // Wait for redirect
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 });
    
    const url = await page.url();
    console.log('📍 After login:', url);
    
    if (url.includes('/chat')) {
      console.log('✅ LOGIN SUCCESS!');
      
      // Test NativeWind
      await page.type('input, textarea', 'Test green bubble message!');
      await page.click('button');
      await page.waitForTimeout(3000);
      
      const greenTest = await page.evaluate(() => {
        const greenDivs = document.querySelectorAll('div[class*="bg-green-500"]');
        return Array.from(greenDivs).map(el => ({
          text: el.textContent?.slice(0, 50),
          isGreen: window.getComputedStyle(el).backgroundColor.includes('34, 197, 94')
        }));
      });
      
      console.log('💚 Green test:', greenTest);
      const working = greenTest.some(t => t.isGreen);
      console.log(working ? '🎉 NativeWind WORKING!' : '❌ No green styling');
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

justLogin().catch(console.error);