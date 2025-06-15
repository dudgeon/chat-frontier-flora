const puppeteer = require('puppeteer');

async function testSendButtonNavigation() {
  console.log('🔍 Testing SendButton navigation and NativeWind classes...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to localhost:19006...');
    await page.goto('http://localhost:19006', { waitUntil: 'networkidle2' });
    
    console.log('⏱️ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if we're on login or signup page by looking for specific text
    const pageContent = await page.content();
    const isSignupPage = pageContent.includes('Create Account');
    const isLoginPage = pageContent.includes('Sign In');
    
    if (isSignupPage && !isLoginPage) {
      console.log('📝 On signup page, switching to login...');
      // Look for "Sign In" link and click it
      const signInLinks = await page.$$('*');
      for (let link of signInLinks) {
        const text = await page.evaluate(el => el.textContent, link);
        if (text && text.trim() === 'Sign In') {
          await link.click();
          break;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    if (isLoginPage || isSignupPage) {
      console.log('🔑 Logging in with test credentials...');
      
      // Fill email
      const emailInput = await page.$('input[type="email"]');
      if (emailInput) {
        await emailInput.type('test@example.com');
      }
      
      // Fill password
      const passwordInput = await page.$('input[type="password"]');
      if (passwordInput) {
        await passwordInput.type('password123');
      }
      
      // Click login button
      const signInButtons = await page.$$('*');
      for (let button of signInButtons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text && text.trim() === 'Sign In' && await page.evaluate(el => el.tagName !== 'A', button)) {
          await button.click();
          break;
        }
      }
      
      console.log('⏳ Waiting for login to complete and navigate to chat...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Now look for the SendButton in the chat interface
    console.log('🔍 Looking for SendButton in chat interface...');
    
    // Take screenshot of current state
    await page.screenshot({ path: 'sendbutton-navigation-current.png', fullPage: true });
    
    // Look for TouchableOpacity elements (SendButton should be one)
    const touchableElements = await page.$$eval('div[data-focusable="true"]', elements => 
      elements.map(el => ({
        className: el.className,
        text: el.textContent.trim(),
        styles: window.getComputedStyle(el)
      }))
    );
    
    console.log(`Found ${touchableElements.length} TouchableOpacity-like elements`);
    
    // Look specifically for SendButton characteristics
    const sendButtonCandidates = await page.$$eval('div', elements => 
      elements.filter(el => {
        const text = el.textContent.trim();
        const className = el.className;
        return text === '➤' || className.includes('w-11') || className.includes('rounded-full');
      }).map(el => ({
        className: el.className,
        text: el.textContent.trim(),
        computedStyles: {
          width: window.getComputedStyle(el).width,
          height: window.getComputedStyle(el).height,
          backgroundColor: window.getComputedStyle(el).backgroundColor,
          borderRadius: window.getComputedStyle(el).borderRadius
        }
      }))
    );
    
    console.log('🎯 SendButton candidates found:', sendButtonCandidates.length);
    sendButtonCandidates.forEach((btn, i) => {
      console.log(`   ${i + 1}. Text: "${btn.text}", className: "${btn.className}"`);
      console.log(`      Styles: ${JSON.stringify(btn.computedStyles)}`);
    });
    
    // Test if NativeWind classes are working
    console.log('\n🧪 Testing NativeWind class application...');
    
    const nativeWindTest = await page.evaluate(() => {
      // Look for elements with NativeWind classes
      const elementsWithNativeWind = Array.from(document.querySelectorAll('*')).filter(el => {
        const className = el.className;
        return className && (
          className.includes('w-11') || 
          className.includes('h-11') || 
          className.includes('bg-blue-500') || 
          className.includes('rounded-full')
        );
      });
      
      return elementsWithNativeWind.map(el => ({
        tagName: el.tagName,
        className: el.className,
        text: el.textContent.trim().substring(0, 20),
        computedStyles: {
          width: window.getComputedStyle(el).width,
          height: window.getComputedStyle(el).height,
          backgroundColor: window.getComputedStyle(el).backgroundColor,
          borderRadius: window.getComputedStyle(el).borderRadius
        }
      }));
    });
    
    console.log(`Found ${nativeWindTest.length} elements with NativeWind classes:`);
    nativeWindTest.forEach((el, i) => {
      console.log(`   ${i + 1}. ${el.tagName}: "${el.text}", className: "${el.className}"`);
      console.log(`      Computed styles: ${JSON.stringify(el.computedStyles)}`);
    });
    
    // Check if blue test square is visible
    console.log('\n🔵 Checking for blue test square (React Native Web sanity check)...');
    const blueSquare = await page.$eval('div[style*="bg-blue-500"]', el => ({
      className: el.className,
      style: el.getAttribute('style'),
      computedStyles: {
        width: window.getComputedStyle(el).width,
        height: window.getComputedStyle(el).height,
        backgroundColor: window.getComputedStyle(el).backgroundColor,
        position: window.getComputedStyle(el).position,
        top: window.getComputedStyle(el).top,
        right: window.getComputedStyle(el).right
      }
    })).catch(() => null);
    
    if (blueSquare) {
      console.log('✅ Blue test square found!');
      console.log(`   className: "${blueSquare.className}"`);
      console.log(`   style: "${blueSquare.style}"`);
      console.log(`   Computed styles: ${JSON.stringify(blueSquare.computedStyles)}`);
    } else {
      console.log('❌ Blue test square not found');
    }
    
    await page.screenshot({ path: 'sendbutton-navigation-final.png', fullPage: true });
    
  } catch (error) {
    console.error('❌ Error during SendButton navigation test:', error.message);
    await page.screenshot({ path: 'sendbutton-navigation-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testSendButtonNavigation().catch(console.error);