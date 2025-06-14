#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function checkValidation() {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-first-run']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking form validation state...');
    
    await page.goto('http://localhost:19006/login');
    await new Promise(r => setTimeout(r, 2000));
    
    // Fill form step by step and check validation
    console.log('📝 Filling email...');
    await page.type('input[type="email"]', 'dudgeon+floratest@gmail.com');
    
    // Trigger blur to validate email
    await page.evaluate(() => {
      document.querySelector('input[type="email"]').blur();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('📝 Filling password...');
    await page.type('input[type="password"]', 'intended*focus3CRAVEN');
    
    // Trigger blur to validate password
    await page.evaluate(() => {
      document.querySelector('input[type="password"]').blur();
    });
    await new Promise(r => setTimeout(r, 2000));
    
    // Check validation state
    const validationState = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const submitButton = document.querySelector('[data-testid="submit-button"]');
      
      return {
        emailValue: emailInput.value,
        passwordValue: passwordInput.value,
        emailValid: emailInput.checkValidity(),
        passwordValid: passwordInput.checkValidity(),
        submitButtonDisabled: submitButton.disabled,
        submitButtonText: submitButton.textContent,
        submitButtonClass: submitButton.className,
        hasFormErrors: Array.from(document.querySelectorAll('*')).some(el => 
          el.textContent && el.textContent.includes('required')
        ),
        console: 'Checking browser console for errors...'
      };
    });
    
    console.log('📊 Validation state:', JSON.stringify(validationState, null, 2));
    
    if (!validationState.submitButtonDisabled) {
      console.log('✅ Submit button is enabled - trying click with different approach...');
      
      // Try clicking with JavaScript instead of Puppeteer
      const jsClickResult = await page.evaluate(() => {
        const button = document.querySelector('[data-testid="submit-button"]');
        if (button) {
          try {
            // Try multiple click approaches
            button.click();
            button.dispatchEvent(new Event('click', { bubbles: true }));
            
            // Also try form submit
            const form = button.closest('form');
            if (form) {
              form.dispatchEvent(new Event('submit', { bubbles: true }));
            }
            
            return { clicked: true, hasForm: !!form };
          } catch (e) {
            return { clicked: false, error: e.message };
          }
        }
        return { clicked: false, error: 'Button not found' };
      });
      
      console.log('🚀 JS click result:', jsClickResult);
      
      // Wait and see if anything changes
      await new Promise(r => setTimeout(r, 5000));
      
      const afterJsClick = await page.evaluate(() => ({
        url: window.location.href,
        onChatPage: window.location.href.includes('/chat'),
        buttonText: document.querySelector('[data-testid="submit-button"]')?.textContent
      }));
      
      console.log('📊 After JS click:', afterJsClick);
      
      if (afterJsClick.onChatPage) {
        console.log('🎉 SUCCESS with JS click approach!');
        
        // Test NativeWind immediately
        await new Promise(r => setTimeout(r, 3000));
        const messageInput = await page.$('input, textarea');
        if (messageInput) {
          await messageInput.type('SUCCESS! Testing green bubbles!');
          const sendBtn = await page.$('button');
          if (sendBtn) {
            await sendBtn.click();
            await new Promise(r => setTimeout(r, 3000));
            
            const nativeWindResult = await page.evaluate(() => {
              const greenDivs = document.querySelectorAll('div[class*="bg-green-500"]');
              const results = Array.from(greenDivs).map(div => ({
                text: div.textContent?.slice(0, 50),
                isGreen: window.getComputedStyle(div).backgroundColor.includes('34, 197, 94')
              }));
              return results.filter(r => r.isGreen);
            });
            
            if (nativeWindResult.length > 0) {
              console.log('🎉 FINAL SUCCESS: NativeWind is working! Found', nativeWindResult.length, 'green message bubbles!');
            } else {
              console.log('❌ Login worked but NativeWind styling not found');
            }
          }
        }
      }
    } else {
      console.log('❌ Submit button is still disabled - validation issue');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await new Promise(r => setTimeout(r, 15000));
    await browser.close();
  }
}

checkValidation().catch(console.error);