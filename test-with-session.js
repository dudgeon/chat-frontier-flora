#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');

async function testWithSession() {
  // Use a persistent user data directory to maintain login state
  const userDataDir = path.join(__dirname, 'puppeteer-user-data');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    userDataDir: userDataDir,  // This maintains session between runs
    args: [
      '--no-first-run',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Navigating to chat page with persistent session...');
    
    // Go directly to chat page (should preserve login if you've logged in before)
    await page.goto('http://localhost:19006/chat', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    
    // Check current page status
    const pageStatus = await page.evaluate(() => ({
      url: window.location.href,
      title: document.title,
      hasMessageInput: !!document.querySelector('input, textarea'),
      bodyText: document.body.innerText.slice(0, 300)
    }));
    
    console.log('📊 Page status:', pageStatus);
    
    if (pageStatus.url.includes('/chat') && pageStatus.hasMessageInput) {
      console.log('✅ Successfully reached chat interface!');
      
      // Send a test message
      const input = await page.$('input, textarea');
      if (input) {
        console.log('📝 Sending test message...');
        await input.type('Testing NativeWind styling - this should be a green user bubble!');
        
        // Find and click send button
        const sendButton = await page.$('button[type="submit"]') || 
                          await page.$('button[aria-label*="send"]') ||
                          await page.$('button[title*="send"]') ||
                          await page.$('button');
        
        if (sendButton) {
          await sendButton.click();
          await new Promise(r => setTimeout(r, 3000));
          
          // Check for user message components with styling
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
          
          await page.screenshot({ path: '/tmp/chat-session-test.png' });
          console.log('📸 Screenshot saved to /tmp/chat-session-test.png');
          
        } else {
          console.log('❌ Could not find send button');
        }
      } else {
        console.log('❌ Could not find message input');
      }
    } else {
      console.log('❌ Not on chat page - may need to login first');
      console.log('💡 Please login manually in the browser that opens, then run this test again');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🔍 Keeping browser open for manual inspection...');
    await new Promise(r => setTimeout(r, 10000));
    await browser.close();
  }
}

testWithSession().catch(console.error);