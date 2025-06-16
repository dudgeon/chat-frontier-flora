const puppeteer = require('puppeteer-core');
const path = require('path');

async function testNativeWindUpgrade() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    userDataDir: path.join(__dirname, 'puppeteer-user-data'),
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });

  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  try {
    console.log('🌐 Navigating to http://localhost:8081/');
    await page.goto('http://localhost:8081/', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for the app to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take screenshot
    await page.screenshot({ path: 'nativewind-upgrade-test.png' });
    
    // Check if React content loaded
    const reactElements = await page.$$('[data-reactroot], #root, #__next');
    console.log(`Found ${reactElements.length} React root elements`);
    
    // Test NativeWind functionality by checking for Tailwind classes
    const elementsWithTailwind = await page.evaluate(() => {
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
    
    console.log(`✅ Found ${elementsWithTailwind} elements with Tailwind classes`);
    
    // Check for specific auth form elements
    const authForm = await page.$('form');
    if (authForm) {
      console.log('✅ Auth form found');
    }
    
    // Check page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Get some page content to verify it loaded
    const textContent = await page.evaluate(() => {
      return document.body.textContent || '';
    });
    
    if (textContent.length > 0) {
      console.log('✅ Page has content');
      console.log(`📄 Content preview: ${textContent.substring(0, 200)}...`);
    } else {
      console.log('❌ No text content found');
    }
    
    console.log('✅ Upgrade test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    await browser.close();
  }
}

testNativeWindUpgrade();