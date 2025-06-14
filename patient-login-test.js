#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');

async function patientLoginTest() {
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
    console.log('🔍 Patient login test - will wait as long as needed...');
    
    // Navigate to login
    await page.goto('http://localhost:19006/login', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    
    console.log('📋 Filling credentials...');
    await page.type('input[type="email"]', 'dudgeon+floratest@gmail.com');
    await page.type('input[type="password"]', 'intended*focus3CRAVEN');
    
    // Check remember me
    const rememberCheckbox = await page.$('[data-testid="remember-me"]');
    if (rememberCheckbox) {
      await rememberCheckbox.click();
      console.log('✅ Checked remember me');
    }
    
    console.log('🚀 Clicking sign in and waiting patiently...');
    await page.click('[data-testid="submit-button"]');
    
    // Wait patiently for up to 60 seconds, checking every 3 seconds
    let attempts = 0;
    const maxAttempts = 20; // 60 seconds total
    let success = false;
    
    while (attempts < maxAttempts && !success) {
      attempts++;
      console.log(`⏳ Attempt ${attempts}/${maxAttempts} - Waiting for auth to complete...`);
      
      await new Promise(r => setTimeout(r, 3000));
      
      const currentUrl = await page.url();
      const pageContent = await page.evaluate(() => ({
        url: window.location.href,
        hasLoadingText: document.body.innerText.includes('Loading'),
        hasSigningInText: document.body.innerText.includes('Signing In'),
        hasErrorText: document.body.innerText.toLowerCase().includes('error'),
        hasInvalidText: document.body.innerText.toLowerCase().includes('invalid'),
        hasChatContent: document.body.innerText.includes('Chat Feature Coming Soon') || 
                       document.querySelector('[data-testid="chat-page"]') !== null,
        hasMessageInput: document.querySelector('input[type="text"], textarea') !== null,
        currentText: document.body.innerText.slice(0, 300)
      }));
      
      console.log(`📍 URL: ${currentUrl}`);
      console.log(`📊 Page state: Loading=${pageContent.hasLoadingText}, SigningIn=${pageContent.hasSigningInText}, Error=${pageContent.hasErrorText}, Chat=${pageContent.hasChatContent}`);
      
      if (pageContent.hasErrorText || pageContent.hasInvalidText) {
        console.log('❌ Authentication error detected:', pageContent.currentText);
        break;
      }
      
      if (currentUrl.includes('/chat') || pageContent.hasChatContent) {
        console.log('🎉 Successfully authenticated and reached chat page!');
        success = true;
        break;
      }
      
      if (pageContent.hasLoadingText || pageContent.hasSigningInText) {
        console.log('⏳ Still loading, continuing to wait...');
        continue;
      }
      
      if (currentUrl.includes('/login') && attempts > 5) {
        console.log('⚠️ Still on login page after 15 seconds, but continuing to wait...');
      }
    }
    
    if (success) {
      console.log('🎉 LOGIN SUCCESS! Now testing NativeWind on real messages...');
      
      // Wait a bit more for chat interface to fully load
      await new Promise(r => setTimeout(r, 5000));
      
      // Look for message input
      const messageInput = await page.$('input[type="text"], textarea');
      if (messageInput) {
        console.log('📝 Found message input - sending test message...');
        await messageInput.type('Testing NativeWind green bubble styling in real chat!');
        
        // Find send button - be flexible about selector
        let sendButton = await page.$('button[type="submit"]') || 
                        await page.$('button[aria-label*="send"]') ||
                        await page.$('button[title*="send"]') ||
                        await page.$('button');
        
        if (sendButton) {
          await sendButton.click();
          console.log('✅ Message sent! Waiting for it to appear...');
          
          await new Promise(r => setTimeout(r, 5000));
          
          // Check for user message components
          const messageResults = await page.evaluate(() => {
            // Look for user message bubbles specifically
            const userMessageElements = Array.from(document.querySelectorAll('div')).filter(el => {
              const className = el.className || '';
              const text = el.textContent || '';
              return (className.includes('bg-green-500') || 
                     className.includes('my-2') ||
                     text.includes('Testing NativeWind'));
            });
            
            return userMessageElements.map(el => {
              const styles = window.getComputedStyle(el);
              return {
                className: el.className,
                text: el.textContent?.slice(0, 100),
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                borderRadius: styles.borderRadius,
                isGreen: styles.backgroundColor.includes('34, 197, 94') || 
                        styles.backgroundColor.includes('rgb(34 197 94') ||
                        styles.backgroundColor === 'rgb(34, 197, 94)',
                element: el.tagName
              };
            });
          });
          
          console.log('💬 Found message elements:', messageResults.length);
          console.log('📋 Message details:', JSON.stringify(messageResults, null, 2));
          
          const greenMessages = messageResults.filter(msg => msg.isGreen);
          if (greenMessages.length > 0) {
            console.log('🎉 SUCCESS: Found', greenMessages.length, 'properly styled green user message bubbles!');
            console.log('✅ NativeWind fix is working correctly in the real chat!');
          } else {
            console.log('❌ Messages found but no green styling detected');
            console.log('🔧 Need to investigate NativeWind CSS application');
          }
          
          await page.screenshot({ path: '/tmp/real-chat-test.png' });
          console.log('📸 Screenshot saved to /tmp/real-chat-test.png');
          
        } else {
          console.log('❌ Could not find send button');
        }
      } else {
        console.log('❌ Could not find message input in chat interface');
      }
    } else {
      console.log('❌ Login did not complete within 60 seconds');
      const finalState = await page.evaluate(() => ({
        url: window.location.href,
        bodyText: document.body.innerText.slice(0, 500)
      }));
      console.log('📊 Final state:', finalState);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🔍 Keeping browser open for 15 seconds for manual inspection...');
    await new Promise(r => setTimeout(r, 15000));
    await browser.close();
  }
}

patientLoginTest().catch(console.error);