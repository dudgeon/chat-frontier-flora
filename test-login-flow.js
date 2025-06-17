const puppeteer = require('puppeteer');

async function testLoginFlow() {
  console.log('🔍 Testing complete login → chat flow...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🚨 BROWSER ERROR:', msg.text());
      } else if (msg.type() === 'warn') {
        console.log('⚠️ BROWSER WARNING:', msg.text());
      } else {
        console.log('🌐 PAGE LOG:', msg.text());
      }
    });
    
    console.log('📡 Step 1: Navigate to /login...');
    await page.goto('http://localhost:8081/login', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const initialState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasEmailInput: !!document.querySelector('input[type="email"]'),
      hasPasswordInput: !!document.querySelector('input[type="password"]'),
      hasSignInButton: !!document.querySelector('button') || !!document.querySelector('[role="button"]')
    }));
    
    console.log('📊 Initial login page state:', initialState);
    
    if (!initialState.hasEmailInput || !initialState.hasPasswordInput) {
      console.log('❌ Login form not found properly');
      return false;
    }
    
    console.log('📧 Step 2: Fill in email and password...');
    
    // Fill in test credentials (using dummy data for testing)
    await page.type('input[type="email"]', 'test@example.com');
    await page.type('input[type="password"]', 'testpassword123');
    
    console.log('🖱️ Step 3: Click sign in button...');
    
    // Find and click the sign in button
    const signInButton = await page.$('button');
    if (signInButton) {
      await signInButton.click();
      console.log('✅ Sign in button clicked');
    } else {
      console.log('❌ Sign in button not found');
      return false;
    }
    
    console.log('⏳ Step 4: Wait for potential navigation...');
    
    // Wait for potential navigation or state changes
    await page.waitForTimeout(3000);
    
    const afterClickState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      hasChatInterface: !!document.querySelector('[testid="chat-page"]'),
      hasProfileButton: !!document.querySelector('[testid="profile-menu-button"]'),
      pageText: document.body.innerText.substring(0, 300)
    }));
    
    console.log('📊 After login attempt state:', afterClickState);
    
    console.log('📡 Step 5: Manually navigate to /chat to test profile menu...');
    await page.goto('http://localhost:8081/chat', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const chatPageState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasChatInterface: !!document.querySelector('[testid="chat-page"]'),
      hasProfileButton: !!document.querySelector('[testid="profile-menu-button"]'),
      profileButtonVisible: (() => {
        const btn = document.querySelector('[testid="profile-menu-button"]');
        return btn ? window.getComputedStyle(btn).display !== 'none' : false;
      })()
    }));
    
    console.log('📊 Chat page state:', chatPageState);
    
    if (chatPageState.hasProfileButton) {
      console.log('🖱️ Step 6: Test profile menu button click...');
      
      const profileButton = await page.$('[testid="profile-menu-button"]');
      await profileButton.click();
      
      await page.waitForTimeout(1000);
      
      const profileMenuState = await page.evaluate(() => ({
        profileMenuVisible: !!document.querySelector('[testid="profile-menu"]'),
        overlayVisible: !!document.querySelector('[testid="profile-menu-overlay"]')
      }));
      
      console.log('📊 Profile menu after click:', profileMenuState);
      
      await page.screenshot({ path: 'login-flow-test.png', fullPage: true });
      console.log('📸 Screenshot saved');
      
      return profileMenuState;
    }
    
    return { error: 'Profile button not found on chat page' };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

testLoginFlow().then(result => {
  console.log('🎯 Login flow test complete');
  if (result && result.profileMenuVisible) {
    console.log('✅ SUCCESS: Profile menu click worked!');
  } else if (result && result.error) {
    console.log('❌ ISSUE:', result.error);
  } else {
    console.log('❌ FAILED: Profile menu click did not work');
  }
  process.exit(0);
});