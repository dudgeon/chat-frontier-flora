const puppeteer = require('puppeteer-core');

async function testPort19006() {
  console.log('🚀 Testing if app is running on port 19006 (Webpack)...');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    console.log('📱 Testing http://localhost:19006/...');
    await page.goto('http://localhost:19006/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    const title = await page.title();
    console.log('✅ Page loaded, title:', title);
    
    // Check for React root
    console.log('⏳ Waiting for React app to mount...');
    await page.waitForSelector('#root', { timeout: 8000 });
    console.log('✅ React root found');
    
    // Check for any content 
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
        console.log('✅ NATIVEWIND IS WORKING!');
      } else {
        console.log('⚠️  No NativeWind classes detected yet');
      }
      
      // Get page content sample
      const textContent = await page.evaluate(() => {
        return document.body.textContent || '';
      });
      console.log(`📄 Content preview: ${textContent.substring(0, 200)}...`);
      
    } else {
      console.log('❌ No content in React root - app may not be mounting');
    }
    
    // Take screenshot for verification
    await page.screenshot({ path: 'port-19006-test.png' });
    console.log('📸 Screenshot saved as port-19006-test.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Try to get basic server response
    try {
      const response = await page.goto('http://localhost:19006/', { waitUntil: 'domcontentloaded', timeout: 3000 });
      console.log('📡 Server response status:', response.status());
    } catch (e) {
      console.log('❌ Server not responding on port 19006');
    }
  } finally {
    await browser.close();
  }
}

testPort19006();