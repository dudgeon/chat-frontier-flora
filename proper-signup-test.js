#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');

async function properSignupTest() {
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
    console.log('🔍 Proper signup test with all required fields...');
    
    await page.goto('http://localhost:19006/signup', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    
    console.log('📝 Filling all required signup fields...');
    
    // Fill full name (first and last name required)
    await page.type('input[placeholder*="name"], input[name="fullName"], input[name="name"]', 'Test User Flora');
    
    // Fill email
    await page.type('input[type="email"]', 'dudgeon+floratest@gmail.com');
    
    // Fill password
    const passwordInputs = await page.$$('input[type="password"]');
    if (passwordInputs.length >= 2) {
      await passwordInputs[0].type('intended*focus3CRAVEN');
      // Fill confirm password
      await passwordInputs[1].type('intended*focus3CRAVEN');
    } else {
      console.log('❌ Could not find password fields');
    }
    
    // Wait for validation
    await new Promise(r => setTimeout(r, 2000));
    
    // Check required checkboxes using testID
    console.log('📋 Checking age verification checkbox...');
    await page.click('[data-testid="age-verification"]');
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('📋 Checking development consent checkbox...');
    await page.click('[data-testid="development-consent"]');
    await new Promise(r => setTimeout(r, 1000));
    
    // Wait for form validation to complete
    await new Promise(r => setTimeout(r, 3000));
    
    // Check submit button state
    const submitState = await page.evaluate(() => {
      const button = document.querySelector('[data-testid="submit-button"]');
      const formState = {
        fullName: document.querySelector('input[placeholder*="name"], input[name="fullName"], input[name="name"]')?.value || '',
        email: document.querySelector('input[type="email"]')?.value || '',
        passwordFields: document.querySelectorAll('input[type="password"]').length,
        checkboxes: Array.from(document.querySelectorAll('input[type="checkbox"]')).map(cb => cb.checked)
      };
      
      return {
        buttonFound: !!button,
        buttonDisabled: button ? button.disabled : null,
        buttonText: button ? button.textContent : null,
        formState: formState
      };
    });
    
    console.log('🔘 Submit state:', JSON.stringify(submitState, null, 2));
    
    if (submitState.buttonFound && !submitState.buttonDisabled) {
      console.log('🚀 Form is valid! Submitting signup...');
      await page.click('[data-testid="submit-button"]');
      
      console.log('⏳ Waiting for signup to complete...');
      
      // Wait patiently for signup completion
      let attempts = 0;
      const maxAttempts = 20;
      let success = false;
      
      while (attempts < maxAttempts && !success) {
        attempts++;
        await new Promise(r => setTimeout(r, 3000));
        
        const currentState = await page.evaluate(() => ({
          url: window.location.href,
          hasChat: document.body.innerText.includes('Chat Feature Coming Soon') ||
                  document.querySelector('[data-testid="chat-page"]') !== null,
          hasError: document.body.innerText.toLowerCase().includes('error'),
          bodyText: document.body.innerText.slice(0, 300)
        }));
        
        console.log(`⏳ Attempt ${attempts}: URL=${currentState.url}, HasChat=${currentState.hasChat}`);
        
        if (currentState.url.includes('/chat') || currentState.hasChat) {
          console.log('🎉 SUCCESS! Reached chat page after signup!');
          success = true;
          break;
        }
        
        if (currentState.hasError) {
          console.log('❌ Error during signup:', currentState.bodyText);
          break;
        }
      }
      
      if (success) {
        console.log('💬 Now testing NativeWind in real chat...');
        
        // Wait for chat interface to load
        await new Promise(r => setTimeout(r, 5000));
        
        // Find and use message input
        const messageInput = await page.$('input[type="text"], textarea, input[placeholder*="message"]');
        if (messageInput) {
          console.log('📝 Sending test message...');
          await messageInput.type('This message should have green bubble styling!');
          
          // Find send button
          const sendButton = await page.$('button[type="submit"]') || 
                            await page.$('button[aria-label*="send"]') ||
                            await page.$('button');
          
          if (sendButton) {
            await sendButton.click();
            console.log('✅ Message sent!');
            
            await new Promise(r => setTimeout(r, 5000));
            
            // Check for NativeWind styling on messages
            const messageResults = await page.evaluate(() => {
              const allElements = Array.from(document.querySelectorAll('*'));
              const messageElements = allElements.filter(el => {
                const className = el.className || '';
                const text = el.textContent || '';
                return className.includes('bg-green-500') || 
                       (text.includes('green bubble styling') && className.includes('my-2'));
              });
              
              return messageElements.map(el => {
                const styles = window.getComputedStyle(el);
                return {
                  tagName: el.tagName,
                  className: el.className,
                  text: el.textContent?.slice(0, 100),
                  backgroundColor: styles.backgroundColor,
                  color: styles.color,
                  borderRadius: styles.borderRadius,
                  isGreen: styles.backgroundColor.includes('34, 197, 94') || 
                          styles.backgroundColor.includes('rgb(34 197 94') ||
                          styles.backgroundColor === 'rgb(34, 197, 94)',
                  hasWhiteText: styles.color === 'rgb(255, 255, 255)' ||
                               styles.color === '#ffffff' ||
                               styles.color === 'white'
                };
              });
            });
            
            console.log('📋 Message styling results:', JSON.stringify(messageResults, null, 2));
            
            const styledMessages = messageResults.filter(m => m.isGreen);
            if (styledMessages.length > 0) {
              console.log('🎉 FINAL SUCCESS: NativeWind is working! Found', styledMessages.length, 'properly styled green message bubbles!');
              console.log('✅ User messages are rendering with green background as expected!');
            } else {
              console.log('❌ No green styling found on messages');
              console.log('🔧 NativeWind CSS injection may not be working properly');
            }
            
            await page.screenshot({ path: '/tmp/final-success-test.png' });
            console.log('📸 Final screenshot saved to /tmp/final-success-test.png');
            
          } else {
            console.log('❌ Could not find send button');
          }
        } else {
          console.log('❌ Could not find message input');
        }
      } else {
        console.log('❌ Signup did not complete successfully');
      }
      
    } else {
      console.log('❌ Form validation failed or submit button still disabled');
      console.log('📋 Form state:', submitState);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🔍 Keeping browser open for inspection...');
    await new Promise(r => setTimeout(r, 20000));
    await browser.close();
  }
}

properSignupTest().catch(console.error);