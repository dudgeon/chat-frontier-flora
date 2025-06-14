#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');

async function signupThenTest() {
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
    console.log('🔍 Trying signup first, then testing NativeWind...');
    
    // Go to signup page
    await page.goto('http://localhost:19006/signup', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    
    console.log('📝 Filling signup form...');
    
    // Fill signup form
    await page.type('input[placeholder*="name"]', 'Test User');
    await page.type('input[type="email"]', 'dudgeon+floratest@gmail.com');
    await page.type('input[type="password"]', 'intended*focus3CRAVEN');
    
    // Find confirm password field
    const passwordInputs = await page.$$('input[type="password"]');
    if (passwordInputs.length > 1) {
      await passwordInputs[1].type('intended*focus3CRAVEN');
    }
    
    // Check required checkboxes
    const checkboxes = await page.$$('input[type="checkbox"]');
    for (let checkbox of checkboxes) {
      await checkbox.click();
    }
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if submit button is enabled
    const submitState = await page.evaluate(() => {
      const button = document.querySelector('[data-testid="submit-button"]');
      return {
        found: !!button,
        disabled: button ? button.disabled : null,
        text: button ? button.textContent : null
      };
    });
    
    console.log('🔘 Submit button state:', submitState);
    
    if (submitState.found && !submitState.disabled) {
      console.log('🚀 Submitting signup...');
      await page.click('[data-testid="submit-button"]');
      
      // Wait longer for signup/redirect
      console.log('⏳ Waiting for signup completion...');
      await new Promise(r => setTimeout(r, 15000));
      
      const finalUrl = await page.url();
      console.log('📍 Final URL after signup:', finalUrl);
      
      if (finalUrl.includes('/chat')) {
        console.log('🎉 SUCCESS! Signed up and redirected to chat!');
        
        // Now test NativeWind messaging
        console.log('💬 Testing NativeWind in real chat...');
        
        // Wait for chat to load
        await new Promise(r => setTimeout(r, 5000));
        
        // Send a test message
        const messageInput = await page.$('input[type="text"], textarea');
        if (messageInput) {
          await messageInput.type('Testing NativeWind green bubbles in real chat!');
          
          // Click send
          const sendButton = await page.$('button[type="submit"]') || await page.$('button');
          if (sendButton) {
            await sendButton.click();
            await new Promise(r => setTimeout(r, 5000));
            
            // Check for styled messages
            const messageTest = await page.evaluate(() => {
              const allDivs = Array.from(document.querySelectorAll('div'));
              const userMessages = allDivs.filter(div => {
                const className = div.className || '';
                const text = div.textContent || '';
                return className.includes('bg-green-500') || 
                       (className.includes('my-2') && text.includes('Testing NativeWind'));
              });
              
              return userMessages.map(el => {
                const styles = window.getComputedStyle(el);
                return {
                  className: el.className,
                  text: el.textContent?.slice(0, 80),
                  backgroundColor: styles.backgroundColor,
                  isGreen: styles.backgroundColor.includes('34, 197, 94') || 
                          styles.backgroundColor.includes('rgb(34 197 94')
                };
              });
            });
            
            console.log('📋 Message test results:', JSON.stringify(messageTest, null, 2));
            
            const greenMessages = messageTest.filter(m => m.isGreen);
            if (greenMessages.length > 0) {
              console.log('🎉 SUCCESS: NativeWind working! Found', greenMessages.length, 'green user messages!');
            } else {
              console.log('❌ No green user messages found - NativeWind may not be working');
            }
            
            await page.screenshot({ path: '/tmp/final-nativewind-test.png' });
            console.log('📸 Screenshot saved to /tmp/final-nativewind-test.png');
            
          } else {
            console.log('❌ Could not find send button');
          }
        } else {
          console.log('❌ Could not find message input');
        }
        
      } else if (finalUrl.includes('/login')) {
        console.log('🔄 Redirected to login - account may already exist, trying login...');
        
        // Try login
        await page.type('input[type="email"]', 'dudgeon+floratest@gmail.com');
        await page.type('input[type="password"]', 'intended*focus3CRAVEN');
        await page.click('[data-testid="submit-button"]');
        
        await new Promise(r => setTimeout(r, 10000));
        const loginResult = await page.url();
        console.log('📍 After login attempt:', loginResult);
        
      } else {
        console.log('❌ Unexpected redirect after signup:', finalUrl);
      }
      
    } else {
      console.log('❌ Submit button not ready:', submitState);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🔍 Keeping browser open for inspection...');
    await new Promise(r => setTimeout(r, 20000));
    await browser.close();
  }
}

signupThenTest().catch(console.error);