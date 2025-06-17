const puppeteer = require('puppeteer');

async function testChatProfileMenu() {
  console.log('🔍 Testing chat page profile menu...');
  
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
    
    console.log('🔍 Analyzing chat page elements...');
    
    // Check for profile menu elements
    const profileElements = await page.evaluate(() => {
      const profileButtons = Array.from(document.querySelectorAll('button, [role="button"]'))
        .filter(el => el.textContent.toLowerCase().includes('profile') || 
                     el.textContent.toLowerCase().includes('menu') ||
                     el.getAttribute('aria-label')?.toLowerCase().includes('profile'));
      
      const rightSideElements = Array.from(document.querySelectorAll('*'))
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.position === 'absolute' && style.right !== 'auto' ||
                 el.style.position === 'absolute' && el.style.right;
        });
      
      return {
        profileButtons: profileButtons.map(el => ({
          text: el.textContent,
          tagName: el.tagName,
          className: el.className,
          style: el.style.cssText
        })),
        rightSideElements: rightSideElements.length,
        totalButtons: document.querySelectorAll('button, [role="button"]').length
      };
    });
    
    console.log('📊 Profile menu analysis:', profileElements);
    
    // Take screenshot
    await page.screenshot({ path: 'chat-profile-menu-test.png', fullPage: true });
    console.log('📸 Screenshot saved as chat-profile-menu-test.png');
    
    return profileElements;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

testChatProfileMenu().then(result => {
  console.log('🎯 Profile menu test complete');
  process.exit(0);
});