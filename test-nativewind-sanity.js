const puppeteer = require('puppeteer');

async function testNativeWindSanity() {
  console.log('🧪 Testing NativeWind Sanity Checks...');

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

    console.log('🔍 Checking current page state...');
    const pageState = await page.evaluate(() => {
      return {
        hasSignupForm: !!document.querySelector('[data-testid="signup-form"]'),
        hasLoginForm: !!document.querySelector('[data-testid="login-form"]'),
        hasChatInterface: !!document.querySelector('[data-testid="chat-interface"]'),
        hasMessageComposer: !!document.querySelector('[data-testid="message-composer"]'),
        currentPath: window.location.pathname,
        title: document.title
      };
    });

    console.log('📊 Page State:', pageState);

    if (pageState.hasSignupForm) {
      console.log('📝 On signup page - need to navigate to chat interface');
      console.log('💡 For testing purposes, let\'s check if we can find any NativeWind classes in the DOM');

      // Check for any elements with NativeWind-style classes
      const nativeWindElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const nativeWindClasses = [];

        elements.forEach(el => {
          const className = el.className;
          if (typeof className === 'string' && className.includes('w-')) {
            nativeWindClasses.push({
              tagName: el.tagName,
              className: className,
              computedStyles: {
                width: window.getComputedStyle(el).width,
                height: window.getComputedStyle(el).height,
                backgroundColor: window.getComputedStyle(el).backgroundColor,
                borderRadius: window.getComputedStyle(el).borderRadius
              }
            });
          }
        });

        return nativeWindClasses;
      });

      console.log('🎨 NativeWind Classes Found:', nativeWindElements.length);
      if (nativeWindElements.length > 0) {
        console.log('✅ NativeWind classes detected in DOM!');
        nativeWindElements.forEach((el, i) => {
          console.log(`  ${i + 1}. ${el.tagName}: ${el.className}`);
          console.log(`     Computed: ${JSON.stringify(el.computedStyles)}`);
        });
      } else {
        console.log('❌ No NativeWind classes found in DOM');
      }
    }

    // Take a screenshot for reference
    await page.screenshot({ path: 'nativewind-sanity-check.png', fullPage: true });

    // Test basic Tailwind classes by injecting a test element
    console.log('🧪 Testing basic Tailwind class generation...');
    const tailwindTest = await page.evaluate(() => {
      // Create a test div with Tailwind classes
      const testDiv = document.createElement('div');
      testDiv.className = 'w-10 h-10 bg-red-500 rounded-lg';
      testDiv.style.position = 'fixed';
      testDiv.style.top = '10px';
      testDiv.style.right = '10px';
      testDiv.style.zIndex = '9999';
      document.body.appendChild(testDiv);

      // Check computed styles
      const computedStyles = window.getComputedStyle(testDiv);
      const result = {
        width: computedStyles.width,
        height: computedStyles.height,
        backgroundColor: computedStyles.backgroundColor,
        borderRadius: computedStyles.borderRadius,
        className: testDiv.className
      };

      // Clean up
      document.body.removeChild(testDiv);

      return result;
    });

    console.log('🎨 Tailwind Test Results:', tailwindTest);

    if (tailwindTest.width === '40px' && tailwindTest.height === '40px') {
      console.log('✅ Tailwind classes are working!');
    } else {
      console.log('❌ Tailwind classes not working properly');
    }

    const analysis = {
      timestamp: new Date().toISOString(),
      pageState,
      nativeWindElements,
      tailwindTest,
      success: tailwindTest.width === '40px' && tailwindTest.height === '40px'
    };

    require('fs').writeFileSync('nativewind-sanity-analysis.json', JSON.stringify(analysis, null, 2));

    console.log('✅ NativeWind sanity check complete!');
    console.log(`📁 Files created: nativewind-sanity-check.png, nativewind-sanity-analysis.json`);

  } catch (error) {
    console.error('❌ Error during sanity check:', error);
  } finally {
    await browser.close();
  }
}

testNativeWindSanity().catch(console.error);
