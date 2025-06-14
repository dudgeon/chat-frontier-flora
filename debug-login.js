#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function debugLogin() {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-first-run']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debug login - checking what happens after button click...');
    
    await page.goto('http://localhost:19006/login');
    await new Promise(r => setTimeout(r, 2000));
    
    // Fill form
    console.log('📝 Filling form...');
    await page.type('input[type="email"]', 'dudgeon+floratest@gmail.com');
    await page.type('input[type="password"]', 'intended*focus3CRAVEN');
    
    // Check form state before clicking
    const beforeClick = await page.evaluate(() => ({
      email: document.querySelector('input[type="email"]').value,
      password: document.querySelector('input[type="password"]').value,
      buttonDisabled: document.querySelector('[data-testid="submit-button"]').disabled,
      buttonText: document.querySelector('[data-testid="submit-button"]').textContent
    }));
    
    console.log('📊 Before click:', beforeClick);
    
    // Click button and immediately check what changes
    console.log('🚀 Clicking login button...');
    await page.click('[data-testid="submit-button"]');
    
    // Check immediately after click
    await new Promise(r => setTimeout(r, 1000));
    
    const afterClick = await page.evaluate(() => ({
      url: window.location.href,
      buttonText: document.querySelector('[data-testid="submit-button"]')?.textContent,
      bodyText: document.body.innerText,
      hasErrorAlert: document.querySelector('[role="alert"]') !== null,
      errorMessages: Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && (
          el.textContent.includes('Invalid') ||
          el.textContent.includes('Error') ||
          el.textContent.includes('incorrect') ||
          el.textContent.includes('failed')
        )
      ).map(el => el.textContent)
    }));
    
    console.log('📊 After click:', afterClick);
    
    // Wait longer and check again
    await new Promise(r => setTimeout(r, 5000));
    
    const finalCheck = await page.evaluate(() => ({
      url: window.location.href,
      onChatPage: window.location.href.includes('/chat'),
      bodyText: document.body.innerText.slice(0, 200)
    }));
    
    console.log('📊 Final check:', finalCheck);
    
    if (finalCheck.onChatPage) {
      console.log('🎉 SUCCESS! Login worked and redirected to chat!');
      
      // Quick NativeWind test
      console.log('💬 Testing NativeWind...');
      const messageInput = await page.$('input, textarea');
      if (messageInput) {
        await messageInput.type('Green bubble test!');
        const sendBtn = await page.$('button');
        if (sendBtn) {
          await sendBtn.click();
          await new Promise(r => setTimeout(r, 3000));
          
          const greenTest = await page.evaluate(() => {
            const greenDivs = document.querySelectorAll('div[class*="bg-green-500"]');
            return greenDivs.length > 0 && 
                   Array.from(greenDivs).some(div => 
                     window.getComputedStyle(div).backgroundColor.includes('34, 197, 94')
                   );
          });
          
          console.log(greenTest ? '🎉 NativeWind WORKING!' : '❌ No green styling');
        }
      }
    } else {
      console.log('❌ Login did not redirect to chat');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await new Promise(r => setTimeout(r, 15000));
    await browser.close();
  }
}

debugLogin().catch(console.error);