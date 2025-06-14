#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function checkConsoleErrors() {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-first-run']
  });
  
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log(`🖥️ CONSOLE ${msg.type()}: ${msg.text()}`);
  });
  
  // Listen for errors
  page.on('pageerror', error => {
    console.log(`🚨 PAGE ERROR: ${error.message}`);
  });
  
  try {
    console.log('🔍 Checking for console errors during login...');
    
    await page.goto('http://localhost:19006/login');
    await new Promise(r => setTimeout(r, 3000));
    
    console.log('📝 Filling form...');
    await page.type('input[type="email"]', 'dudgeon+floratest@gmail.com');
    await page.type('input[type="password"]', 'intended*focus3CRAVEN');
    
    console.log('🚀 Clicking button (watching for errors)...');
    await page.click('[data-testid="submit-button"]');
    
    // Wait and watch console
    console.log('⏳ Waiting 10 seconds for any async errors...');
    await new Promise(r => setTimeout(r, 10000));
    
    const finalUrl = await page.url();
    console.log('📍 Final URL:', finalUrl);
    
    if (finalUrl.includes('/chat')) {
      console.log('🎉 SUCCESS! Login worked!');
      
      // Test NativeWind
      console.log('💬 Testing NativeWind in chat...');
      const messageInput = await page.$('input, textarea');
      if (messageInput) {
        await messageInput.type('Final test of green bubbles!');
        const sendBtn = await page.$('button');
        if (sendBtn) {
          await sendBtn.click();
          await new Promise(r => setTimeout(r, 3000));
          
          const greenTest = await page.evaluate(() => {
            const greenDivs = document.querySelectorAll('div[class*="bg-green-500"]');
            const greenCount = Array.from(greenDivs).filter(div => 
              window.getComputedStyle(div).backgroundColor.includes('34, 197, 94')
            ).length;
            return greenCount;
          });
          
          if (greenTest > 0) {
            console.log('🎉 COMPLETE SUCCESS: Login worked AND NativeWind is working!');
            console.log(`✅ Found ${greenTest} properly styled green message bubbles!`);
          } else {
            console.log('✅ Login worked but no green styling found');
          }
        }
      }
    } else {
      console.log('❌ Still on login page after button click');
    }
    
  } catch (error) {
    console.error('❌ Script Error:', error);
  } finally {
    await new Promise(r => setTimeout(r, 10000));
    await browser.close();
  }
}

checkConsoleErrors().catch(console.error);