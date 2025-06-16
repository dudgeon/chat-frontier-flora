const puppeteer = require('puppeteer');

async function testNativeWindVsHTML() {
  console.log('🧪 Testing NativeWind vs HTML Element Behavior...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });

  const page = await browser.newPage();

  try {
    console.log('📍 Navigating to localhost:19006...');
    await page.goto('http://localhost:19006', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test both HTML elements and check what CSS is actually available
    const testResults = await page.evaluate(() => {
      // First, check what CSS rules are actually available
      const availableCSS = [];
      const stylesheets = Array.from(document.styleSheets);

      stylesheets.forEach(sheet => {
        try {
          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule.selectorText && rule.selectorText.includes('w-11')) {
                availableCSS.push({
                  selector: rule.selectorText,
                  cssText: rule.cssText
                });
              }
            });
          }
        } catch (e) {
          // Skip inaccessible stylesheets
        }
      });

      // Test HTML div element
      const htmlDiv = document.createElement('div');
      htmlDiv.className = 'w-11 h-11 bg-blue-500 rounded-full';
      htmlDiv.style.position = 'fixed';
      htmlDiv.style.top = '10px';
      htmlDiv.style.right = '10px';
      htmlDiv.style.zIndex = '9999';
      document.body.appendChild(htmlDiv);

      const htmlStyles = window.getComputedStyle(htmlDiv);
      const htmlResult = {
        width: htmlStyles.width,
        height: htmlStyles.height,
        backgroundColor: htmlStyles.backgroundColor,
        borderRadius: htmlStyles.borderRadius
      };

      // Test if we can find any React Native components with NativeWind classes
      const rnComponents = [];
      const allElements = document.querySelectorAll('*');

      allElements.forEach(el => {
        const className = el.className;
        if (typeof className === 'string' && className.includes('css-view-175oi2r')) {
          // This is a React Native View component
          const computedStyles = window.getComputedStyle(el);
          rnComponents.push({
            className: className,
            tagName: el.tagName,
            styles: {
              width: computedStyles.width,
              height: computedStyles.height,
              backgroundColor: computedStyles.backgroundColor,
              borderRadius: computedStyles.borderRadius
            }
          });
        }
      });

      // Clean up test element
      document.body.removeChild(htmlDiv);

      return {
        availableCSS,
        htmlResult,
        rnComponents: rnComponents.slice(0, 5), // Limit to first 5 for readability
        totalRNComponents: rnComponents.length
      };
    });

    console.log('📊 Test Results:');

    console.log('\n🎨 Available CSS Rules for w-11:');
    if (testResults.availableCSS.length > 0) {
      testResults.availableCSS.forEach(rule => {
        console.log(`  ${rule.selector}: ${rule.cssText}`);
      });
    } else {
      console.log('  ❌ No w-11 CSS rules found in stylesheets');
    }

    console.log('\n🌐 HTML Element Test (div with w-11 h-11 bg-blue-500 rounded-full):');
    console.log(`  Width: ${testResults.htmlResult.width}`);
    console.log(`  Height: ${testResults.htmlResult.height}`);
    console.log(`  Background: ${testResults.htmlResult.backgroundColor}`);
    console.log(`  Border Radius: ${testResults.htmlResult.borderRadius}`);

    const htmlWorking = testResults.htmlResult.width !== '0px' && testResults.htmlResult.width !== 'auto';
    console.log(`  Status: ${htmlWorking ? '✅ Working' : '❌ Not Working'}`);

    console.log(`\n📱 React Native Components Found: ${testResults.totalRNComponents}`);
    console.log('Sample RN Components:');
    testResults.rnComponents.forEach((comp, i) => {
      console.log(`  ${i + 1}. ${comp.tagName}: ${comp.className.substring(0, 50)}...`);
      console.log(`     Styles: w=${comp.styles.width}, h=${comp.styles.height}, bg=${comp.styles.backgroundColor}`);
    });

    // Take a screenshot to see the visual result
    await page.screenshot({ path: 'nativewind-vs-html-test.png', fullPage: true });

    // Save detailed analysis
    const analysis = {
      timestamp: new Date().toISOString(),
      testResults,
      htmlWorking,
      conclusion: htmlWorking ?
        'HTML elements can use Tailwind classes - issue might be with React Native component processing' :
        'CSS classes not being generated or loaded properly'
    };

    require('fs').writeFileSync('nativewind-vs-html-analysis.json', JSON.stringify(analysis, null, 2));

    console.log('\n✅ NativeWind vs HTML test complete!');
    console.log('📁 Files created: nativewind-vs-html-test.png, nativewind-vs-html-analysis.json');

  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await browser.close();
  }
}

testNativeWindVsHTML().catch(console.error);
