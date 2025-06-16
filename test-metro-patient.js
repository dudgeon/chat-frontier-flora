const puppeteer = require('puppeteer-core');

async function testMetroPatient() {
  console.log('🚀 Testing Metro with patient timeout...');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    console.log('📱 Attempting to load http://localhost:8081/ (60s timeout)...');
    
    // Try to load the page with much longer timeout
    await page.goto('http://localhost:8081/', { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });
    
    console.log('✅ Page loaded successfully!');
    const title = await page.title();
    console.log('📄 Title:', title);
    
    // Check for React root
    console.log('⏳ Looking for React app mount...');
    try {
      await page.waitForSelector('#root', { timeout: 10000 });
      console.log('✅ React root found');
      
      // Check for content 
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
          console.log('✅ NATIVEWIND IS WORKING ON METRO!');
        } else {
          console.log('⚠️  No NativeWind classes detected');
        }
        
        // Get page content sample
        const textContent = await page.evaluate(() => {
          return document.body.textContent || '';
        });
        console.log(`📄 Content preview: ${textContent.substring(0, 200)}...`);
        
      } else {
        console.log('⚠️ React root exists but no content');
      }
      
    } catch (e) {
      console.log('⚠️ No React root found, checking raw HTML response...');
      const bodyText = await page.evaluate(() => document.body.textContent);
      console.log('📄 Body content:', bodyText?.substring(0, 200) || 'Empty');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'metro-test.png' });
    console.log('📸 Screenshot saved as metro-test.png');
    
  } catch (error) {
    console.error('❌ Error loading page:', error.message);
    
    // Try to get response status
    try {
      const response = await page.goto('http://localhost:8081/', { 
        waitUntil: 'domcontentloaded', 
        timeout: 5000 
      });
      if (response) {
        console.log('📡 Response status:', response.status());
        console.log('📡 Response headers:', response.headers());
      }
    } catch (e) {
      console.log('❌ Server completely unresponsive');
    }
  } finally {
    await browser.close();
  }
}

testMetroPatient();