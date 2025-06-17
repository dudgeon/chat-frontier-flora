const puppeteer = require('puppeteer');
const fs = require('fs');

// Load test credentials
function loadTestCredentials() {
  try {
    const envContent = fs.readFileSync('.env.stagehand', 'utf8');
    const credentials = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        credentials[key] = value;
      }
    });
    return credentials;
  } catch (error) {
    console.error('❌ Could not load test credentials from .env.stagehand:', error.message);
    return null;
  }
}

async function testCompleteAuthFlow() {
  console.log('🔍 Testing complete authentication flow with real credentials...');
  
  const credentials = loadTestCredentials();
  if (!credentials || !credentials.TEST_LOGIN_EMAIL || !credentials.TEST_LOGIN_PASSWORD) {
    console.error('❌ Test credentials not found in .env.stagehand');
    return false;
  }
  
  console.log('✅ Loaded test credentials for:', credentials.TEST_LOGIN_EMAIL);
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      console.log('🌐 PAGE LOG:', msg.text());
    });
    
    console.log('\n📡 TEST 1: Verify unauthenticated /chat redirects to root...');
    await page.goto('http://localhost:8081/chat', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const chatRedirectTest = await page.evaluate(() => ({
      url: window.location.pathname,
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      hasChatInterface: !!document.querySelector('[data-testid="chat-page"]')
    }));
    
    console.log('📊 /chat redirect result:', chatRedirectTest);
    const chatRedirectWorked = chatRedirectTest.url === '/' && chatRedirectTest.hasLoginForm;
    console.log(chatRedirectWorked ? '✅ /chat redirect works' : '❌ /chat redirect failed');
    
    console.log('\n📡 TEST 2: Login with real credentials...');
    await page.goto('http://localhost:8081/login', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Fill in real credentials
    await page.type('input[type="email"]', credentials.TEST_LOGIN_EMAIL);
    await page.type('input[type="password"]', credentials.TEST_LOGIN_PASSWORD);
    
    console.log('🖱️ Clicking Sign In button...');
    const signInButton = await page.$('[data-testid="submit-button"]');
    await signInButton.click();
    
    // Wait for authentication and potential redirect
    console.log('⏳ Waiting for authentication response...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const afterLoginState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      hasChatInterface: !!document.querySelector('[data-testid="chat-page"]'),
      hasProfileButton: !!document.querySelector('[data-testid="profile-menu-button"]')
    }));
    
    console.log('📊 After login state:', afterLoginState);
    const loginRedirectWorked = afterLoginState.url === '/chat' && afterLoginState.hasChatInterface;
    console.log(loginRedirectWorked ? '✅ Login → /chat redirect works' : '❌ Login → /chat redirect failed');
    
    if (!loginRedirectWorked) {
      console.log('❌ Login failed or redirect not working, stopping test');
      await page.screenshot({ path: 'auth-flow-login-failed.png', fullPage: true });
      return false;
    }
    
    console.log('\n📡 TEST 3: Test logout and redirect to root...');
    
    // Open profile menu
    const profileButton = await page.$('[data-testid="profile-menu-button"]');
    if (!profileButton) {
      console.log('❌ Profile button not found');
      return false;
    }
    
    await profileButton.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const profileMenuState = await page.evaluate(() => ({
      profileMenuVisible: !!document.querySelector('[data-testid="profile-menu"]'),
      logoutButtonExists: !!document.querySelector('[data-testid="logout-button"]')
    }));
    
    console.log('📊 Profile menu state:', profileMenuState);
    
    if (!profileMenuState.logoutButtonExists) {
      console.log('❌ Logout button not found in profile menu');
      return false;
    }
    
    // Click logout button
    const logoutButton = await page.$('[data-testid="logout-button"]');
    await logoutButton.click();
    console.log('🖱️ Clicked logout button');
    
    // Wait for logout and redirect
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const afterLogoutState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      hasChatInterface: !!document.querySelector('[data-testid="chat-page"]'),
      hasProfileButton: !!document.querySelector('[data-testid="profile-menu-button"]')
    }));
    
    console.log('📊 After logout state:', afterLogoutState);
    const logoutRedirectWorked = afterLogoutState.url === '/' && afterLogoutState.hasLoginForm && !afterLogoutState.hasChatInterface;
    console.log(logoutRedirectWorked ? '✅ Logout → root redirect works' : '❌ Logout → root redirect failed');
    
    console.log('\n📡 TEST 4: Verify direct /chat access after logout redirects...');
    await page.goto('http://localhost:8081/chat', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const finalRedirectTest = await page.evaluate(() => ({
      url: window.location.pathname,
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      hasChatInterface: !!document.querySelector('[data-testid="chat-page"]')
    }));
    
    console.log('📊 Final /chat redirect test:', finalRedirectTest);
    const finalRedirectWorked = finalRedirectTest.url === '/' && finalRedirectTest.hasLoginForm;
    console.log(finalRedirectWorked ? '✅ Post-logout /chat redirect works' : '❌ Post-logout /chat redirect failed');
    
    await page.screenshot({ path: 'complete-auth-flow-test.png', fullPage: true });
    console.log('📸 Screenshot saved as complete-auth-flow-test.png');
    
    const allTestsPassed = chatRedirectWorked && loginRedirectWorked && logoutRedirectWorked && finalRedirectWorked;
    
    return {
      chatRedirectWorked,
      loginRedirectWorked, 
      logoutRedirectWorked,
      finalRedirectWorked,
      allTestsPassed
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

testCompleteAuthFlow().then(result => {
  console.log('\n🎯 COMPLETE AUTHENTICATION FLOW TEST RESULTS:');
  
  if (result) {
    console.log('================================');
    console.log('Chat redirect (unauthenticated):', result.chatRedirectWorked ? '✅ PASS' : '❌ FAIL');
    console.log('Login → chat redirect:', result.loginRedirectWorked ? '✅ PASS' : '❌ FAIL'); 
    console.log('Logout → root redirect:', result.logoutRedirectWorked ? '✅ PASS' : '❌ FAIL');
    console.log('Post-logout chat redirect:', result.finalRedirectWorked ? '✅ PASS' : '❌ FAIL');
    console.log('================================');
    console.log('OVERALL RESULT:', result.allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  } else {
    console.log('❌ Test execution failed');
  }
  
  process.exit(result?.allTestsPassed ? 0 : 1);
});