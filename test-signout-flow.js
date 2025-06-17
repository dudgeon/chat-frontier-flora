const puppeteer = require('puppeteer');

async function testSignoutFlow() {
  console.log('🔍 Testing signout flow and routing...');
  
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
    
    console.log('📡 Step 1: Navigate to /chat page...');
    await page.goto('http://localhost:8081/chat', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const initialState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasChatInterface: !!document.querySelector('[data-testid="chat-page"]'),
      hasProfileButton: !!document.querySelector('[data-testid="profile-menu-button"]')
    }));
    
    console.log('📊 Initial chat page state:', initialState);
    
    if (!initialState.hasProfileButton) {
      console.log('❌ Profile button not found, cannot test signout');
      return false;
    }
    
    console.log('📡 Step 2: Open profile menu...');
    const profileButton = await page.$('[data-testid="profile-menu-button"]');
    await profileButton.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const menuOpenState = await page.evaluate(() => ({
      profileMenuVisible: !!document.querySelector('[data-testid="profile-menu"]'),
      overlayVisible: !!document.querySelector('[data-testid="profile-menu-overlay"]')
    }));
    
    console.log('📊 Profile menu open state:', menuOpenState);
    
    if (!menuOpenState.profileMenuVisible) {
      console.log('❌ Profile menu did not open, cannot test signout');
      return false;
    }
    
    console.log('📡 Step 3: Look for signout/logout button...');
    
    // Look for logout/signout buttons in the profile menu
    const logoutButtons = await page.evaluate(() => {
      const profileMenu = document.querySelector('[data-testid="profile-menu"]');
      if (!profileMenu) return [];
      
      // Look for elements with logout-related text
      const allElements = Array.from(profileMenu.querySelectorAll('*'));
      const logoutElements = allElements.filter(el => {
        const text = el.textContent?.toLowerCase() || '';
        return text.includes('logout') || 
               text.includes('sign out') || 
               text.includes('signout') ||
               text.includes('log out');
      });
      
      return logoutElements.map(el => ({
        tagName: el.tagName,
        textContent: el.textContent?.trim(),
        className: el.className,
        testId: el.getAttribute('data-testid'),
        clickable: el.tagName === 'DIV' && (el.style.cursor === 'pointer' || window.getComputedStyle(el).cursor === 'pointer')
      }));
    });
    
    console.log('🔍 Found logout elements:', logoutButtons);
    
    if (logoutButtons.length === 0) {
      console.log('❌ No logout button found in profile menu');
      
      // Let's see what's actually in the profile menu
      const menuContents = await page.evaluate(() => {
        const profileMenu = document.querySelector('[data-testid="profile-menu"]');
        if (!profileMenu) return 'Profile menu not found';
        
        return Array.from(profileMenu.querySelectorAll('*')).map(el => ({
          tagName: el.tagName,
          textContent: el.textContent?.trim().substring(0, 50),
          testId: el.getAttribute('data-testid'),
          hasOnClick: !!el.onclick
        })).filter(el => el.textContent); // Only elements with text
      });
      
      console.log('📋 Profile menu contents:', menuContents);
      return { error: 'No logout button found', menuContents };
    }
    
    console.log('📡 Step 4: Click logout button...');
    
    // Find the first clickable logout element
    const logoutSelector = logoutButtons.find(btn => btn.testId || btn.clickable);
    
    if (logoutSelector && logoutSelector.testId) {
      const logoutButton = await page.$(`[data-testid="${logoutSelector.testId}"]`);
      if (logoutButton) {
        await logoutButton.click();
        console.log('🖱️ Clicked logout button with testID:', logoutSelector.testId);
      }
    } else {
      // Try clicking by text content
      const logoutButton = await page.evaluateHandle(() => {
        const profileMenu = document.querySelector('[data-testid="profile-menu"]');
        if (!profileMenu) return null;
        
        const allElements = Array.from(profileMenu.querySelectorAll('*'));
        return allElements.find(el => {
          const text = el.textContent?.toLowerCase() || '';
          return (text.includes('logout') || text.includes('sign out')) && 
                 (el.style.cursor === 'pointer' || window.getComputedStyle(el).cursor === 'pointer');
        });
      });
      
      if (logoutButton) {
        await logoutButton.click();
        console.log('🖱️ Clicked logout button by text content');
      }
    }
    
    console.log('📡 Step 5: Wait for potential navigation after logout...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const afterLogoutState = await page.evaluate(() => ({
      url: window.location.pathname,
      hasChatInterface: !!document.querySelector('[data-testid="chat-page"]'),
      hasLoginForm: !!document.querySelector('input[type="email"]'),
      pageText: document.body.innerText.substring(0, 200)
    }));
    
    console.log('📊 After logout state:', afterLogoutState);
    
    const logoutWorked = afterLogoutState.url !== '/chat' || afterLogoutState.hasLoginForm;
    console.log(logoutWorked ? '✅ Logout redirect worked!' : '❌ Logout redirect failed - still on chat page');
    
    await page.screenshot({ path: 'signout-flow-test.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
    return {
      initialState,
      menuOpenState,
      logoutButtons,
      afterLogoutState,
      logoutWorked
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

testSignoutFlow().then(result => {
  console.log('🎯 Signout flow test complete');
  if (result) {
    console.log('📋 Summary:');
    console.log('- Profile menu opens:', result.menuOpenState?.profileMenuVisible);
    console.log('- Logout buttons found:', result.logoutButtons?.length || 0);
    console.log('- Logout redirect works:', result.logoutWorked);
  }
  process.exit(0);
});