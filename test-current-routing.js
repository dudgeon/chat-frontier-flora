const puppeteer = require('puppeteer');

async function testCurrentRouting() {
  console.log('🔍 Testing current routing behavior...');
  
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
    
    console.log('📡 Test 1: Navigate to /chat (should redirect to login)...');
    await page.goto('http://localhost:8081/chat', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const chatPageState = await page.evaluate(() => ({
      url: window.location.pathname,
      title: document.title,
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      hasChatInterface: !!document.querySelector('[testid="chat-page"]'),
      bodyText: document.body.innerText.substring(0, 200)
    }));
    
    console.log('📊 /chat result:', chatPageState);
    
    console.log('📡 Test 2: Navigate to root / (should show login)...');
    await page.goto('http://localhost:8081/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const rootPageState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      hasEmailInput: !!document.querySelector('input[placeholder*="email" i]'),
      hasPasswordInput: !!document.querySelector('input[type="password"]')
    }));
    
    console.log('📊 / result:', rootPageState);
    
    console.log('📡 Test 3: Navigate to /login explicitly...');
    await page.goto('http://localhost:8081/login', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const loginPageState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      hasSignInButton: !!document.querySelector('button') || !!document.querySelector('[role="button"]')
    }));
    
    console.log('📊 /login result:', loginPageState);
    
    await page.screenshot({ path: 'current-routing-test.png', fullPage: true });
    console.log('📸 Screenshot saved as current-routing-test.png');
    
    return {
      chatPageRedirect: chatPageState,
      rootPage: rootPageState,
      loginPage: loginPageState
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

testCurrentRouting().then(result => {
  console.log('🎯 Routing test complete');
  if (result) {
    console.log('📋 Summary:');
    console.log('- /chat redirects properly:', result.chatPageRedirect.hasLoginForm);
    console.log('- Root shows login:', result.rootPage.hasLoginForm);
    console.log('- /login shows login:', result.loginPage.hasLoginForm);
  }
  process.exit(0);
});