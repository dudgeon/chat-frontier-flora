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

async function testBlueUserBubble() {
  console.log('🎨 Testing blue user message bubble by sending a test message...');
  
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
    
    // Wait for authentication and redirect to chat
    console.log('⏳ Waiting for authentication and redirect to chat...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const afterLoginState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasChatInterface: !!document.querySelector('[data-testid="chat-page"]'),
      hasMessageInput: !!document.querySelector('[data-testid="message-input"]'),
      hasSendButton: !!document.querySelector('[data-testid="send-button"]')
    }));
    
    console.log('📊 After login state:', afterLoginState);
    
    if (!afterLoginState.hasChatInterface) {
      console.log('❌ Chat interface not found after login');
      await page.screenshot({ path: 'blue-bubble-test-login-failed.png', fullPage: true });
      return false;
    }
    
    console.log('✅ Successfully on chat page, looking for message input...');
    
    // Find the message input field
    const messageInput = await page.$('[data-testid="message-input"]');
    if (!messageInput) {
      console.log('❌ Message input field not found');
      
      // Let's inspect what input elements exist
      const inputElements = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, textarea'));
        return inputs.map(input => ({
          type: input.type,
          placeholder: input.placeholder,
          testId: input.getAttribute('data-testid'),
          className: input.className
        }));
      });
      
      console.log('📊 Available input elements:', inputElements);
      await page.screenshot({ path: 'blue-bubble-test-no-input.png', fullPage: true });
      return false;
    }
    
    console.log('📡 Step 2: Send a test message to create user bubble...');
    
    // Type a test message
    const testMessage = 'Test blue bubble message';
    await messageInput.type(testMessage);
    
    // Find and click send button
    const sendButton = await page.$('[data-testid="send-button"]');
    if (!sendButton) {
      console.log('❌ Send button not found');
      
      // Look for any buttons that might be the send button
      const buttons = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button, [data-testid]'));
        return btns.map(btn => ({
          text: btn.textContent,
          testId: btn.getAttribute('data-testid'),
          className: btn.className,
          tagName: btn.tagName
        }));
      });
      
      console.log('📊 Available buttons and testID elements:', buttons);
      await page.screenshot({ path: 'blue-bubble-test-no-send-button.png', fullPage: true });
      return false;
    }
    
    await sendButton.click();
    console.log('🖱️ Sent test message:', testMessage);
    
    // Wait for message to appear
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📡 Step 3: Verify blue user message bubble appears...');
    
    const bubbleAnalysis = await page.evaluate(() => ({
      blueUserBubbles: Array.from(document.querySelectorAll('.bg-blue-500')).length,
      greenBubbles: Array.from(document.querySelectorAll('.bg-green-500')).length,
      allBubbleClasses: Array.from(document.querySelectorAll('[class*="bg-"]')).map(el => ({
        className: el.className,
        text: el.textContent.trim()
      })),
      userMessages: Array.from(document.querySelectorAll('[class*="bg-blue"]')).map(el => el.textContent.trim()),
      messageCount: Array.from(document.querySelectorAll('[class*="items-end"], [class*="items-start"]')).length
    }));
    
    console.log('📊 Bubble analysis:', bubbleAnalysis);
    console.log('📊 Blue user bubbles found:', bubbleAnalysis.blueUserBubbles);
    console.log('📊 Green bubbles (should be 0):', bubbleAnalysis.greenBubbles);
    console.log('📊 User message text:', bubbleAnalysis.userMessages);
    
    await page.screenshot({ path: 'blue-bubble-test-result.png', fullPage: true });
    console.log('📸 Screenshot saved as blue-bubble-test-result.png');
    
    // Verify the blue bubble feature worked
    const blueBookSuccessful = bubbleAnalysis.blueUserBubbles > 0 && 
                              bubbleAnalysis.userMessages.some(msg => msg.includes('Test blue bubble message'));
    
    if (blueBookSuccessful) {
      console.log('✅ Blue user bubble feature working correctly!');
    } else {
      console.log('❌ Blue user bubble feature not working as expected');
    }
    
    return {
      success: blueBookSuccessful,
      blueUserBubbles: bubbleAnalysis.blueUserBubbles,
      greenBubbles: bubbleAnalysis.greenBubbles,
      userMessages: bubbleAnalysis.userMessages,
      testMessage
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'blue-bubble-test-error.png', fullPage: true });
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

testBlueUserBubble().then(result => {
  console.log('🎯 Blue user bubble test complete');
  if (result.success) {
    console.log('✅ SUCCESS: Blue user bubble feature is working correctly');
    console.log('📋 Results:');
    console.log('- Blue user bubbles created:', result.blueUserBubbles);
    console.log('- Green bubbles (should be 0):', result.greenBubbles);
    console.log('- Test message found in user messages:', result.userMessages.includes(result.testMessage));
  } else {
    console.log('❌ FAILED: Blue user bubble feature not working');
    console.log('Error:', result.error);
  }
  process.exit(result.success ? 0 : 1);
});