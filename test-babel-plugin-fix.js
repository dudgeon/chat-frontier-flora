const puppeteer = require('puppeteer');

async function testBabelPluginFix() {
  console.log('🔍 Testing NativeWind babel plugin fix...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to localhost:19006...');
    await page.goto('http://localhost:19006', { waitUntil: 'networkidle2' });
    
    console.log('⏱️ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check for console errors
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    // Check for our test element and its actual DOM attributes
    const testElementInfo = await page.evaluate(() => {
      // Look for our test element
      const testElement = document.querySelector('div[class*="bg-blue-500"]') || 
                         document.querySelector('div[class*="!bg-blue-500"]') ||
                         document.querySelector('div[class*="w-10"]') ||
                         document.querySelector('div[class*="!w-10"]');
      
      if (testElement) {
        return {
          found: true,
          className: testElement.className,
          style: testElement.getAttribute('style'),
          computedStyles: {
            width: window.getComputedStyle(testElement).width,
            height: window.getComputedStyle(testElement).height,
            backgroundColor: window.getComputedStyle(testElement).backgroundColor,
            position: window.getComputedStyle(testElement).position,
            top: window.getComputedStyle(testElement).top,
            right: window.getComputedStyle(testElement).right
          }
        };
      }
      
      // If no test element, check what elements do exist
      const allDivs = Array.from(document.querySelectorAll('div')).slice(0, 5);
      return {
        found: false,
        sampleElements: allDivs.map(el => ({
          className: el.className,
          style: el.getAttribute('style'),
          text: el.textContent.substring(0, 50)
        }))
      };
    });
    
    console.log('\n🎯 Test Element Analysis:');
    if (testElementInfo.found) {
      console.log('✅ Test element found!');
      console.log(`   className: "${testElementInfo.className}"`);
      console.log(`   style: "${testElementInfo.style}"`);
      console.log('   Computed styles:', JSON.stringify(testElementInfo.computedStyles, null, 2));
    } else {
      console.log('❌ Test element not found');
      console.log('Sample elements on page:');
      testElementInfo.sampleElements.forEach((el, i) => {
        console.log(`   ${i + 1}. className: "${el.className}", text: "${el.text}"`);
      });
    }
    
    // Check for CSS imports in the page source
    const cssImports = await page.evaluate(() => {
      const imports = [];
      // Check for link tags
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        imports.push({
          type: 'link',
          href: link.href
        });
      });
      
      // Check for style tags
      document.querySelectorAll('style').forEach(style => {
        imports.push({
          type: 'style',
          content: style.textContent.substring(0, 100) + '...'
        });
      });
      
      return imports;
    });
    
    console.log('\n📄 CSS Resources:');
    if (cssImports.length > 0) {
      cssImports.forEach((imp, i) => {
        console.log(`   ${i + 1}. ${imp.type}: ${imp.href || imp.content}`);
      });
    } else {
      console.log('   ❌ No CSS resources found');
    }
    
    // Capture console messages
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n📝 Console Messages:');
    if (consoleMessages.length > 0) {
      consoleMessages.forEach(msg => {
        console.log(`   ${msg.type}: ${msg.text}`);
      });
    } else {
      console.log('   ✅ No console messages');
    }
    
    await page.screenshot({ path: 'babel-plugin-fix-test.png', fullPage: true });
    
  } catch (error) {
    console.error('❌ Error during babel plugin test:', error.message);
    await page.screenshot({ path: 'babel-plugin-fix-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testBabelPluginFix().catch(console.error);