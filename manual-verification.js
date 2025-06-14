#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');

async function manualVerification() {
  const userDataDir = path.join(__dirname, 'puppeteer-user-data');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    userDataDir: userDataDir,
    args: [
      '--no-first-run',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Opening browser for manual verification...');
    console.log('📋 Please manually:');
    console.log('   1. Login with test credentials if needed');
    console.log('   2. Navigate to /chat');
    console.log('   3. Send a message');
    console.log('   4. Check if user messages appear with green background');
    console.log('');
    console.log('⏳ Waiting 2 minutes for manual verification...');
    
    // Navigate to home page
    await page.goto('http://localhost:19006', { waitUntil: 'networkidle0' });
    
    // Wait for manual interaction
    await new Promise(r => setTimeout(r, 120000)); // 2 minutes
    
    // Check final state
    const currentUrl = await page.url();
    console.log('📍 Final URL:', currentUrl);
    
    if (currentUrl.includes('/chat')) {
      console.log('✅ On chat page - checking for styled messages...');
      
      // Check for user message styling
      const messages = await page.evaluate(() => {
        const userMessages = document.querySelectorAll('div[class*="bg-green-500"], div[class*="my-2"]');
        return Array.from(userMessages).map(el => {
          const styles = window.getComputedStyle(el);
          return {
            className: el.className,
            text: el.textContent?.slice(0, 80),
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            borderRadius: styles.borderRadius,
            isGreen: styles.backgroundColor.includes('34, 197, 94') || 
                    styles.backgroundColor.includes('rgb(34 197 94') ||
                    styles.backgroundColor === 'rgb(34, 197, 94)'
          };
        });
      });
      
      console.log('💬 Message components found:', messages.length);
      console.log('📋 Message details:', JSON.stringify(messages, null, 2));
      
      const greenMessages = messages.filter(msg => msg.isGreen);
      if (greenMessages.length > 0) {
        console.log('🎉 SUCCESS: Found', greenMessages.length, 'properly styled green user message bubbles!');
        console.log('✅ NativeWind fix is working correctly!');
      } else {
        console.log('❌ ISSUE: User messages found but not styled with green background');
        console.log('🔧 NativeWind CSS may not be applying correctly');
      }
      
      await page.screenshot({ path: '/tmp/manual-verification.png' });
      console.log('📸 Screenshot saved to /tmp/manual-verification.png');
    } else {
      console.log('ℹ️ Not on chat page - manual verification incomplete');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🔍 Closing browser...');
    await browser.close();
  }
}

manualVerification().catch(console.error);