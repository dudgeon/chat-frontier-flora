const puppeteer = require('puppeteer-core');
const path = require('path');

async function testBasicLoad() {
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
    console.log('🌐 Navigating to http://localhost:19006/');
    await page.goto('http://localhost:19006/', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait a moment for rendering
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot
    await page.screenshot({ path: 'basic-load-test.png' });
    
    // Check if any React content loaded
    const reactRoot = await page.$('#root');
    if (reactRoot) {
      console.log('✅ React root element found');
      const textContent = await page.evaluate(() => document.body.textContent);
      console.log('📄 Page text content (first 200 chars):', textContent.substring(0, 200));
    } else {
      console.log('❌ React root element not found');
    }
    
    // Check for manually styled NativeWind test elements by their computed styles
    const blueBox = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div'));
      return elements.find(el => {
        const style = window.getComputedStyle(el);
        return style.width === '40px' && style.height === '40px' && 
               style.backgroundColor === 'rgb(59, 130, 246)' && // blue-500
               style.position === 'absolute';
      });
    });
    
    if (blueBox) {
      console.log('✅ Blue test element found (by computed styles)');
      const styles = await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll('div')).find(el => {
          const style = window.getComputedStyle(el);
          return style.width === '40px' && style.height === '40px' && 
                 style.backgroundColor === 'rgb(59, 130, 246)';
        });
        if (el) {
          const computed = window.getComputedStyle(el);
          return {
            width: computed.width,
            height: computed.height,
            backgroundColor: computed.backgroundColor,
            position: computed.position,
            top: computed.top,
            right: computed.right,
            zIndex: computed.zIndex
          };
        }
        return null;
      });
      console.log('🎨 Blue element styles:', styles);
    } else {
      console.log('❌ Blue test element not found');
    }
    
    const greenBox = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div'));
      return elements.find(el => {
        const style = window.getComputedStyle(el);
        return style.width === '32px' && style.height === '32px' && 
               style.backgroundColor === 'rgb(16, 185, 129)' && // green-500
               style.borderRadius === '9999px';
      });
    });
    
    if (greenBox) {
      console.log('✅ Green test element found (by computed styles)');
      const greenStyles = await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll('div')).find(el => {
          const style = window.getComputedStyle(el);
          return style.width === '32px' && style.height === '32px' && 
                 style.backgroundColor === 'rgb(16, 185, 129)';
        });
        if (el) {
          const computed = window.getComputedStyle(el);
          return {
            width: computed.width,
            height: computed.height,
            backgroundColor: computed.backgroundColor,
            borderRadius: computed.borderRadius,
            position: computed.position
          };
        }
        return null;
      });
      console.log('🎨 Green element styles:', greenStyles);
    } else {
      console.log('❌ Green test element not found');
    }
    
    const redBox = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div'));
      return elements.find(el => {
        const style = window.getComputedStyle(el);
        return style.width === '48px' && style.height === '16px' && 
               style.backgroundColor === 'rgb(239, 68, 68)'; // red-500
      });
    });
    
    if (redBox) {
      console.log('✅ Red test element found (by computed styles)');
    } else {
      console.log('❌ Red test element not found');
    }
    
    const textBox = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div'));
      return elements.find(el => {
        const style = window.getComputedStyle(el);
        return style.backgroundColor === 'rgb(229, 231, 235)' && // gray-200
               style.paddingLeft === '16px' && style.paddingRight === '16px';
      });
    });
    
    if (textBox) {
      console.log('✅ Text container element found (by computed styles)');
    } else {
      console.log('❌ Text container element not found');
    }
    
    // Count all Tailwind-styled elements in the existing UI
    const tailwindElements = await page.$$('[class*="bg-"], [class*="w-"], [class*="h-"], [class*="p-"]');
    console.log(`📊 Total Tailwind-styled elements in existing UI: ${tailwindElements.length}`);
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  }

  await browser.close();
}

testBasicLoad().catch(console.error);