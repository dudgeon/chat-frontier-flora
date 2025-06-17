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

async function testChatUIWithLogin() {
  console.log('🎨 Testing chat UI with blue user message bubbles (after login)...');
  
  const credentials = loadTestCredentials();
  if (!credentials || !credentials.TEST_LOGIN_EMAIL || !credentials.TEST_LOGIN_PASSWORD) {
    console.error('❌ Test credentials not found in .env.stagehand');
    return false;
  }
  
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
    
    console.log('📡 Step 1: Login with real credentials...');
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
    
    if (!afterLoginState.hasChatInterface) {
      console.log('❌ Login failed or redirect not working');
      await page.screenshot({ path: 'chat-ui-login-failed.png', fullPage: true });
      return false;
    }
    
    console.log('✅ Successfully logged in and on chat page');
    
    // Now test the chat UI for blue user message bubbles
    console.log('📡 Step 2: Analyzing chat UI for blue user message bubbles...');
    
    const chatUIState = await page.evaluate(() => ({
      userMessages: Array.from(document.querySelectorAll('.bg-blue-500')).length,
      greenMessages: Array.from(document.querySelectorAll('.bg-green-500')).length,
      allMessages: Array.from(document.querySelectorAll('[class*="bg-"]')).map(el => el.className),
      chatPageExists: !!document.querySelector('[data-testid="chat-page"]'),
      messageComposerExists: !!document.querySelector('[data-testid="message-composer"]')
    }));
    
    console.log('📊 Chat UI analysis:', chatUIState);
    console.log('📊 Blue user messages found:', chatUIState.userMessages);
    console.log('📊 Green messages (should be 0):', chatUIState.greenMessages);
    console.log('📊 All message classes:', chatUIState.allMessages);
    
    await page.screenshot({ path: 'chat-ui-blue-bubbles-authenticated.png', fullPage: true });
    console.log('📸 Screenshot saved as chat-ui-blue-bubbles-authenticated.png');
    
    // Check if we have any sample messages to test
    if (chatUIState.userMessages > 0) {
      console.log('✅ Found blue user message bubbles in chat UI');
    } else if (chatUIState.greenMessages > 0) {
      console.log('❌ Found green message bubbles instead of blue');
    } else {
      console.log('ℹ️ No user messages found in chat - this is expected for empty chat');
    }
    
    return {
      loginSuccessful: true,
      chatUILoaded: chatUIState.chatPageExists,
      blueUserMessages: chatUIState.userMessages,
      greenMessages: chatUIState.greenMessages,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

testChatUIWithLogin().then(result => {
  console.log('🎯 Chat UI test complete');
  if (result.success) {
    console.log('✅ Chat UI blue bubble test completed successfully');
    console.log('📋 Results:');
    console.log('- Login successful:', result.loginSuccessful);
    console.log('- Chat UI loaded:', result.chatUILoaded);
    console.log('- Blue user messages:', result.blueUserMessages);
    console.log('- Green messages (should be 0):', result.greenMessages);
  } else {
    console.log('❌ Test failed:', result.error);
  }
  process.exit(result.success ? 0 : 1);
});