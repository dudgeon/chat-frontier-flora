const puppeteer = require('puppeteer');

async function testHolisticAuthRouting() {
  console.log('🔍 Testing holistic authentication routing...');
  
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
    
    console.log('📡 Test 1: Navigate to /chat as unauthenticated user...');
    await page.goto('http://localhost:8081/chat', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const chatRedirectTest = await page.evaluate(() => ({
      url: window.location.pathname,
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      hasChatInterface: !!document.querySelector('[data-testid="chat-page"]'),
      pageText: document.body.innerText.substring(0, 100)
    }));
    
    console.log('📊 /chat redirect result:', chatRedirectTest);
    
    console.log('📡 Test 2: Navigate to root / ...');
    await page.goto('http://localhost:8081/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const rootTest = await page.evaluate(() => ({
      url: window.location.pathname,
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      hasChatInterface: !!document.querySelector('[data-testid="chat-page"]')
    }));
    
    console.log('📊 Root page result:', rootTest);
    
    console.log('📡 Test 3: Test logout redirect by going to /chat then clicking logout...');
    await page.goto('http://localhost:8081/chat', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if we got redirected away from chat
    const afterChatNavigation = await page.evaluate(() => ({
      url: window.location.pathname,
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      hasChatInterface: !!document.querySelector('[data-testid="chat-page"]')
    }));
    
    console.log('📊 After navigating to /chat:', afterChatNavigation);
    
    // If we're still on chat page (meaning routing logic didn't work), try manual logout
    if (afterChatNavigation.hasChatInterface) {
      console.log('📡 Still on chat page, testing logout button...');
      
      // Open profile menu
      const profileButton = await page.$('[data-testid="profile-menu-button"]');
      if (profileButton) {
        await profileButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Click logout
        const logoutButton = await page.$('[data-testid="logout-button"]');
        if (logoutButton) {
          await logoutButton.click();
          console.log('🖱️ Clicked logout button');
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const afterLogout = await page.evaluate(() => ({
            url: window.location.pathname,
            hasLoginForm: !!document.querySelector('input[type="email"]'),
            hasChatInterface: !!document.querySelector('[data-testid="chat-page"]')
          }));
          
          console.log('📊 After logout:', afterLogout);
          
          const logoutRedirectWorked = afterLogout.url === '/' && afterLogout.hasLoginForm;
          console.log(logoutRedirectWorked ? '✅ Logout redirect worked!' : '❌ Logout redirect failed');
          
          await page.screenshot({ path: 'holistic-auth-routing-test.png', fullPage: true });
          
          return {
            chatRedirectTest,
            rootTest,
            afterChatNavigation,
            afterLogout,
            logoutRedirectWorked
          };
        }
      }
    }
    
    await page.screenshot({ path: 'holistic-auth-routing-test.png', fullPage: true });
    
    return {
      chatRedirectTest,
      rootTest,
      afterChatNavigation,
      routingWorked: afterChatNavigation.hasLoginForm
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

testHolisticAuthRouting().then(result => {
  console.log('🎯 Holistic auth routing test complete');
  if (result) {
    console.log('📋 Summary:');
    console.log('- /chat redirects to login:', result.chatRedirectTest?.hasLoginForm);
    console.log('- Root shows login:', result.rootTest?.hasLoginForm);
    console.log('- Routing logic works:', result.routingWorked || result.logoutRedirectWorked);
  }
  process.exit(0);
});