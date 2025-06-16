const puppeteer = require('puppeteer-core');

async function testAppLoading() {
  console.log('🚀 Testing app loading and NativeWind...');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    console.log('📱 Navigating to http://localhost:8081/...');
    await page.goto('http://localhost:8081/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    const title = await page.title();
    console.log('✅ Page loaded, title:', title);
    
    // Wait for React root
    console.log('⏳ Waiting for React app to mount...');
    await page.waitForSelector('#root', { timeout: 10000 });
    console.log('✅ React root found');
    
    // Check for any content in the root
    const hasContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.textContent && root.textContent.trim().length > 0;
    });
    
    if (hasContent) {
      console.log('✅ App has content - React is rendering');
      
      // Check for NativeWind classes
      const nativeWindElements = await page.evaluate(() => {
        const allElements = Array.from(document.querySelectorAll('*'));
        return allElements.filter(el => {
          const className = el.className;
          return typeof className === 'string' && (
            className.includes('bg-') || 
            className.includes('text-') || 
            className.includes('p-') || 
            className.includes('m-') ||
            className.includes('flex') ||
            className.includes('rounded')
          );
        }).length;
      });
      
      console.log(`🎨 Found ${nativeWindElements} elements with NativeWind classes`);
      
      if (nativeWindElements > 0) {
        console.log('✅ NativeWind is working!');
      } else {
        console.log('⚠️  No NativeWind classes detected yet');
      }
      
    } else {
      console.log('❌ No content in React root - app may not be mounting');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'app-loading-test.png' });
    console.log('📸 Screenshot saved as app-loading-test.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testAppLoading();