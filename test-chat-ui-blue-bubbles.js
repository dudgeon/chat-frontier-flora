const puppeteer = require('puppeteer');

async function testChatUIBlueUserMessage() {
  console.log('🎨 Testing chat UI with blue user message bubbles...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('📡 Loading chat page directly...');
    await page.goto('http://localhost:8081/chat', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for any automatic redirects
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pageState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasChatInterface: !!document.querySelector('[data-testid="chat-page"]'),
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      userMessages: Array.from(document.querySelectorAll('.bg-blue-500')).length,
      greenMessages: Array.from(document.querySelectorAll('.bg-green-500')).length
    }));
    
    console.log('📊 Chat UI test result:', pageState);
    
    if (pageState.hasChatInterface) {
      console.log('✅ Chat interface loaded successfully');
      console.log('📊 Blue user messages found:', pageState.userMessages);
      console.log('📊 Green messages (should be 0):', pageState.greenMessages);
      
      await page.screenshot({ path: 'chat-ui-blue-bubbles-test.png', fullPage: true });
      console.log('📸 Screenshot saved as chat-ui-blue-bubbles-test.png');
      
      return { success: true, ...pageState };
    } else {
      console.log('❌ Chat interface not loaded, got redirected to login');
      return { success: false, ...pageState };
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

testChatUIBlueUserMessage().then(result => {
  console.log('🎯 Chat UI test complete:', result.success ? '✅ SUCCESS' : '❌ FAILED');
  process.exit(result.success ? 0 : 1);
});