const puppeteer = require('puppeteer');

async function testReactNativeWebFlow() {
  console.log('🔍 Testing React Native Web button interactions...');
  
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
    
    console.log('📡 Step 1: Navigate to /login and test Sign In button...');
    await page.goto('http://localhost:8081/login', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Fill in dummy credentials
    await page.type('input[type="email"]', 'test@example.com');
    await page.type('input[type="password"]', 'testpassword123');
    
    // Find Sign In button by testID (React Native Web style)
    const signInButton = await page.$('[data-testid="submit-button"]');
    
    if (signInButton) {
      console.log('✅ Found Sign In button with testID');
      await signInButton.click();
      console.log('🖱️ Clicked Sign In button');
      
      // Wait for any auth response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const afterSignIn = await page.evaluate(() => ({
        url: window.location.pathname,
        hasLoginForm: !!document.querySelector('input[type="email"]')
      }));
      
      console.log('📊 After Sign In attempt:', afterSignIn);
    } else {
      console.log('❌ Sign In button not found with testID');
    }
    
    console.log('📡 Step 2: Navigate to /chat and test profile menu...');
    await page.goto('http://localhost:8081/chat', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Find profile button by testID
    const profileButton = await page.$('[data-testid="profile-menu-button"]');
    
    if (profileButton) {
      console.log('✅ Found profile button with testID');
      
      // Check initial profile menu state
      const initialMenuState = await page.evaluate(() => ({
        profileMenuVisible: !!document.querySelector('[data-testid="profile-menu"]'),
        overlayVisible: !!document.querySelector('[data-testid="profile-menu-overlay"]')
      }));
      
      console.log('📊 Initial profile menu state:', initialMenuState);
      
      // Click profile button
      await profileButton.click();
      console.log('🖱️ Clicked profile button');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const afterClickMenuState = await page.evaluate(() => ({
        profileMenuVisible: !!document.querySelector('[data-testid="profile-menu"]'),
        overlayVisible: !!document.querySelector('[data-testid="profile-menu-overlay"]')
      }));
      
      console.log('📊 After click profile menu state:', afterClickMenuState);
      
      const profileMenuWorked = afterClickMenuState.profileMenuVisible !== initialMenuState.profileMenuVisible;
      console.log(profileMenuWorked ? '✅ Profile menu click worked!' : '❌ Profile menu click failed');
      
      // Take screenshot showing profile menu state
      await page.screenshot({ path: 'react-native-web-profile-test.png', fullPage: true });
      console.log('📸 Screenshot saved');
      
      return {
        signInButtonFound: true,
        profileButtonFound: true,
        profileMenuWorked,
        initialMenuState,
        afterClickMenuState
      };
      
    } else {
      console.log('❌ Profile button not found with testID');
      
      // Let's see what testIDs are available
      const availableTestIds = await page.evaluate(() => {
        const elementsWithTestId = Array.from(document.querySelectorAll('[data-testid]'));
        return elementsWithTestId.map(el => ({
          testId: el.getAttribute('data-testid'),
          tagName: el.tagName,
          textContent: el.textContent?.trim().substring(0, 50)
        }));
      });
      
      console.log('📋 Available testIDs:', availableTestIds);
      
      return {
        signInButtonFound: !!signInButton,
        profileButtonFound: false,
        availableTestIds
      };
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

testReactNativeWebFlow().then(result => {
  console.log('🎯 React Native Web flow test complete');
  if (result) {
    console.log('📋 Results:', JSON.stringify(result, null, 2));
  }
  process.exit(0);
});