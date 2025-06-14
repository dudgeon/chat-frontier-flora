#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');

async function loginAndTest() {
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
    console.log('🔍 Starting login process...');
    
    // Navigate to home page
    await page.goto('http://localhost:19006', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    
    // Look for sign in link
    const signInLink = await page.$('text/Sign In');
    if (signInLink) {
      console.log('📝 Clicking Sign In...');
      await signInLink.click();
      await new Promise(r => setTimeout(r, 2000));
    }
    
    // Fill in login credentials
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    
    if (emailInput && passwordInput) {
      console.log('🔐 Entering credentials...');
      await emailInput.type('dudgeon+floratest@gmail.com');
      await passwordInput.type('intended*focus3CRAVEN');
      
      // Check "remember me" if available
      const rememberCheckbox = await page.$('input[type="checkbox"]');
      if (rememberCheckbox) {
        console.log('✅ Checking remember me...');
        await rememberCheckbox.click();
      }
      
      // Click sign in button
      const signInButton = await page.$('button[type="submit"]') || await page.$('button');
      if (signInButton) {
        console.log('🚀 Signing in...');
        await signInButton.click();
        await new Promise(r => setTimeout(r, 5000));
      }
    }
    
    // Navigate to chat
    console.log('💬 Navigating to chat...');
    await page.goto('http://localhost:19006/chat', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    
    // Check if we're on chat page
    const currentUrl = await page.url();
    console.log('📍 Current URL:', currentUrl);
    
    if (currentUrl.includes('/chat')) {
      console.log('✅ Successfully reached chat interface!');
      
      // Send a test message
      const messageInput = await page.$('input[type="text"], textarea');
      if (messageInput) {
        console.log('📝 Sending test message...');
        await messageInput.type('Testing NativeWind styling - this should be a green user bubble!');
        
        // Find and click send button
        const sendButton = await page.$('button[type="submit"]') || 
                          await page.$('button[aria-label*="send"]') ||
                          await page.$('button[title*="send"]') ||
                          await page.$('button');
        
        if (sendButton) {
          await sendButton.click();
          await new Promise(r => setTimeout(r, 3000));
          
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
          
          await page.screenshot({ path: '/tmp/chat-test-with-login.png' });
          console.log('📸 Screenshot saved to /tmp/chat-test-with-login.png');
          
        } else {
          console.log('❌ Could not find send button');
        }
      } else {
        console.log('❌ Could not find message input');
      }
    } else {
      console.log('❌ Login may have failed, not on chat page');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🔍 Keeping browser open for manual inspection...');
    await new Promise(r => setTimeout(r, 15000));
    await browser.close();
  }
}

loginAndTest().catch(console.error);