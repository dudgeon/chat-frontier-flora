#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');

async function testLoginRoute() {
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
    console.log('🔍 Testing new /login route...');
    
    // Navigate directly to login page
    await page.goto('http://localhost:19006/login', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    
    // Verify we're on the login page
    const pageInfo = await page.evaluate(() => ({
      url: window.location.href,
      title: document.title,
      hasEmailInput: !!document.querySelector('input[type="email"]'),
      hasPasswordInput: !!document.querySelector('input[type="password"]'),
      hasSignInButton: !!document.querySelector('[data-testid="submit-button"]'),
      hasSignUpLink: !!document.querySelector('[data-testid="switch-to-signup"]'),
      bodyText: document.body.innerText.slice(0, 200)
    }));
    
    console.log('📊 Login page info:', pageInfo);
    
    if (pageInfo.hasEmailInput && pageInfo.hasPasswordInput && pageInfo.hasSignInButton) {
      console.log('✅ Login page loaded successfully with expected form elements!');
      
      // Fill in test credentials
      console.log('🔐 Filling in test credentials...');
      await page.type('input[type="email"]', 'dudgeon+floratest@gmail.com');
      await page.type('input[type="password"]', 'intended*focus3CRAVEN');
      
      // Check remember me if available
      const rememberCheckbox = await page.$('[data-testid="remember-me"]');
      if (rememberCheckbox) {
        console.log('✅ Checking remember me...');
        await rememberCheckbox.click();
      }
      
      // Click sign in
      console.log('🚀 Clicking sign in...');
      await page.click('[data-testid="submit-button"]');
      
      // Wait for navigation
      await new Promise(r => setTimeout(r, 8000));
      
      const finalUrl = await page.url();
      console.log('📍 Final URL after login:', finalUrl);
      
      if (finalUrl.includes('/chat')) {
        console.log('🎉 Successfully logged in and redirected to chat!');
        console.log('💬 Now testing NativeWind styling...');
        
        // Test message input and send
        const messageInput = await page.$('input[type="text"], textarea');
        if (messageInput) {
          console.log('📝 Sending test message...');
          await messageInput.type('Test message to verify green bubble styling works!');
          
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
            
            await page.screenshot({ path: '/tmp/login-route-test.png' });
            console.log('📸 Screenshot saved to /tmp/login-route-test.png');
            
          } else {
            console.log('❌ Could not find send button in chat');
          }
        } else {
          console.log('❌ Could not find message input in chat');
        }
      } else {
        console.log('❌ Login may have failed or did not redirect to chat');
        console.log('📍 Current URL:', finalUrl);
      }
    } else {
      console.log('❌ Login page did not load correctly');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🔍 Keeping browser open for 10 seconds for inspection...');
    await new Promise(r => setTimeout(r, 10000));
    await browser.close();
  }
}

testLoginRoute().catch(console.error);