const puppeteer = require('puppeteer-core');
const path = require('path');

async function testNativeWindComprehensive() {
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
    
    // Wait for React to render
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot to show all NativeWind elements
    await page.screenshot({ path: 'nativewind-comprehensive-test.png', fullPage: true });
    console.log('📸 Screenshot saved: nativewind-comprehensive-test.png');
    
    // Test if elements exist by looking for specific patterns
    const elementCounts = await page.evaluate(() => {
      const allDivs = Array.from(document.querySelectorAll('div'));
      let styledElements = 0;
      let blueElements = 0;
      let greenElements = 0;
      let redElements = 0;
      let positionedElements = 0;
      
      allDivs.forEach(el => {
        const style = window.getComputedStyle(el);
        
        // Count elements with background colors
        if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          styledElements++;
          
          // Count specific test colors
          if (style.backgroundColor === 'rgb(59, 130, 246)') blueElements++; // blue-500
          if (style.backgroundColor === 'rgb(16, 185, 129)') greenElements++; // green-500  
          if (style.backgroundColor === 'rgb(239, 68, 68)') redElements++; // red-500
        }
        
        // Count absolutely positioned elements
        if (style.position === 'absolute') {
          positionedElements++;
        }
      });
      
      return {
        totalDivs: allDivs.length,
        styledElements,
        blueElements,
        greenElements,
        redElements,
        positionedElements
      };
    });
    
    console.log('📊 Element Analysis:');
    console.log(`   Total divs: ${elementCounts.totalDivs}`);
    console.log(`   Elements with background colors: ${elementCounts.styledElements}`);
    console.log(`   Blue elements (blue-500): ${elementCounts.blueElements}`);
    console.log(`   Green elements (green-500): ${elementCounts.greenElements}`);
    console.log(`   Red elements (red-500): ${elementCounts.redElements}`);
    console.log(`   Absolutely positioned: ${elementCounts.positionedElements}`);
    
    // Test text content
    const testTextExists = await page.evaluate(() => {
      return document.body.textContent.includes('Test Text') || document.body.textContent.includes('Flex Layout');
    });
    
    if (testTextExists) {
      console.log('✅ NativeWind test text found in page');
    } else {
      console.log('❌ NativeWind test text not found');
    }
    
    // Overall assessment
    const totalNativeWindElements = elementCounts.blueElements + elementCounts.greenElements + elementCounts.redElements;
    if (totalNativeWindElements >= 3) {
      console.log(`🎉 SUCCESS: ${totalNativeWindElements} NativeWind-style elements are working flawlessly!`);
    } else {
      console.log(`⚠️  Only ${totalNativeWindElements} NativeWind elements found`);
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  }

  await browser.close();
}

testNativeWindComprehensive().catch(console.error);