#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');

async function simpleLoginTest() {
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
    console.log('🔍 Simple login test...');
    
    await page.goto('http://localhost:19006/login', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('📋 Filling form...');
    await page.type('input[type="email"]', 'dudgeon+floratest@gmail.com');
    await page.type('input[type="password"]', 'intended*focus3CRAVEN');
    
    // Check button state before clicking
    const buttonState = await page.evaluate(() => {
      const button = document.querySelector('[data-testid="submit-button"]');
      if (!button) return { found: false };
      
      return {
        found: true,
        disabled: button.disabled || button.getAttribute('disabled') !== null,
        text: button.textContent,
        clickable: button.style.pointerEvents !== 'none'
      };
    });
    
    console.log('🔘 Button state:', buttonState);
    
    if (buttonState.found && !buttonState.disabled) {
      console.log('🚀 Clicking sign in button...');
      
      // Try multiple click approaches
      try {
        await page.click('[data-testid="submit-button"]');
        console.log('✅ Button clicked successfully');
      } catch (e) {
        console.log('⚠️ Direct click failed, trying evaluate click:', e.message);
        await page.evaluate(() => {
          document.querySelector('[data-testid="submit-button"]').click();
        });
      }
      
      // Wait and check what happens
      console.log('⏳ Waiting for response...');
      await new Promise(r => setTimeout(r, 10000));
      
      const result = await page.evaluate(() => ({
        url: window.location.href,
        bodyText: document.body.innerText.slice(0, 500)
      }));
      
      console.log('📊 After click result:', result);
      
      if (result.url.includes('/chat')) {
        console.log('🎉 SUCCESS! Redirected to chat - login worked!');
        
        // Test NativeWind in real chat
        await page.type('input[type="text"], textarea', 'NativeWind test message!');
        await page.click('button'); // Send button
        await new Promise(r => setTimeout(r, 3000));
        
        const messages = await page.evaluate(() => {
          const greenElements = document.querySelectorAll('div[class*="bg-green-500"]');
          return Array.from(greenElements).map(el => {
            const styles = window.getComputedStyle(el);
            return {
              text: el.textContent?.slice(0, 50),
              backgroundColor: styles.backgroundColor,
              isGreen: styles.backgroundColor.includes('34, 197, 94')
            };
          });
        });
        
        console.log('💬 Message test results:', messages);
        const greenMessages = messages.filter(m => m.isGreen);
        
        if (greenMessages.length > 0) {
          console.log('🎉 NativeWind working! Found', greenMessages.length, 'green messages');
        } else {
          console.log('❌ No green messages found');
        }
        
      } else {
        console.log('❌ Still on login page - checking for errors...');
      }
      
    } else {
      console.log('❌ Button not clickable:', buttonState);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🔍 Keeping browser open for inspection...');
    await new Promise(r => setTimeout(r, 15000));
    await browser.close();
  }
}

simpleLoginTest().catch(console.error);