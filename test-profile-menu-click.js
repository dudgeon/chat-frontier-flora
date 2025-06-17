const puppeteer = require('puppeteer');

async function testProfileMenuClick() {
  console.log('🔍 Testing profile menu button click functionality...');
  
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
    
    console.log('📡 Navigating to /chat...');
    await page.goto('http://localhost:8081/chat', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('🔍 Looking for profile menu button...');
    
    // Find the profile button
    const profileButton = await page.$('[testid="profile-menu-button"], button:has-text("👤")');
    
    if (!profileButton) {
      console.log('❌ Profile button not found');
      return false;
    }
    
    console.log('✅ Profile button found');
    
    // Check initial state
    const initialState = await page.evaluate(() => {
      const profileMenu = document.querySelector('[testid="profile-menu"]');
      const overlay = document.querySelector('[testid="profile-menu-overlay"]');
      return {
        profileMenuVisible: !!profileMenu,
        overlayVisible: !!overlay,
        buttonCount: document.querySelectorAll('button').length
      };
    });
    
    console.log('📊 Initial state:', initialState);
    
    // Click the profile button
    console.log('🖱️ Clicking profile button...');
    await profileButton.click();
    
    // Wait a moment for potential state changes
    await page.waitForTimeout(1000);
    
    // Check state after click
    const afterClickState = await page.evaluate(() => {
      const profileMenu = document.querySelector('[testid="profile-menu"]');
      const overlay = document.querySelector('[testid="profile-menu-overlay"]');
      return {
        profileMenuVisible: !!profileMenu,
        overlayVisible: !!overlay,
        buttonCount: document.querySelectorAll('button').length
      };
    });
    
    console.log('📊 After click state:', afterClickState);
    
    // Take screenshots
    await page.screenshot({ path: 'profile-menu-before-click.png', fullPage: true });
    
    // Try clicking again to see if it's a toggle issue
    console.log('🖱️ Clicking profile button again...');
    await profileButton.click();
    await page.waitForTimeout(1000);
    
    const secondClickState = await page.evaluate(() => {
      const profileMenu = document.querySelector('[testid="profile-menu"]');
      const overlay = document.querySelector('[testid="profile-menu-overlay"]');
      return {
        profileMenuVisible: !!profileMenu,
        overlayVisible: !!overlay,
        buttonCount: document.querySelectorAll('button').length
      };
    });
    
    console.log('📊 After second click state:', secondClickState);
    
    await page.screenshot({ path: 'profile-menu-after-clicks.png', fullPage: true });
    console.log('📸 Screenshots saved');
    
    // Check if click handlers are properly attached
    const buttonInfo = await page.evaluate(() => {
      const button = document.querySelector('[testid="profile-menu-button"]');
      if (!button) return { found: false };
      
      return {
        found: true,
        hasOnClick: !!button.onclick,
        hasEventListeners: !!button.getEventListeners,
        disabled: button.disabled,
        attributes: Array.from(button.attributes).map(attr => ({ name: attr.name, value: attr.value })),
        onclick: button.onclick ? button.onclick.toString() : null
      };
    });
    
    console.log('🔍 Button analysis:', buttonInfo);
    
    return {
      initialState,
      afterClickState,
      secondClickState,
      buttonInfo,
      clickWorked: afterClickState.profileMenuVisible !== initialState.profileMenuVisible
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

testProfileMenuClick().then(result => {
  if (result) {
    console.log('🎯 Click test result:', result.clickWorked ? 'SUCCESS - Click worked' : 'FAILED - Click did nothing');
  }
  process.exit(0);
});