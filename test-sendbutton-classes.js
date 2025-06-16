const puppeteer = require('puppeteer');

async function testSendButtonClasses() {
  console.log('🔘 Testing SendButton NativeWind Classes...');

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

    // Test the specific classes used by SendButton
    const sendButtonClassTest = await page.evaluate(() => {
      const testClasses = [
        'w-11',      // width: 44px (11 * 4px)
        'h-11',      // height: 44px
        'rounded-full', // border-radius: 9999px
        'bg-blue-500',  // background: blue
        'bg-gray-400',  // background: gray
        'text-white',   // color: white
        'text-lg',      // font-size: large
        'font-semibold', // font-weight: 600
        'flex',         // display: flex
        'items-center', // align-items: center
        'justify-center', // justify-content: center
        'shadow-sm'     // box-shadow: small
      ];

      const results = {};

      testClasses.forEach(className => {
        // Create test element
        const testDiv = document.createElement('div');
        testDiv.className = className;
        testDiv.style.position = 'fixed';
        testDiv.style.top = '-1000px'; // Hide it
        document.body.appendChild(testDiv);

        // Get computed styles
        const computedStyles = window.getComputedStyle(testDiv);
        results[className] = {
          width: computedStyles.width,
          height: computedStyles.height,
          backgroundColor: computedStyles.backgroundColor,
          borderRadius: computedStyles.borderRadius,
          color: computedStyles.color,
          fontSize: computedStyles.fontSize,
          fontWeight: computedStyles.fontWeight,
          display: computedStyles.display,
          alignItems: computedStyles.alignItems,
          justifyContent: computedStyles.justifyContent,
          boxShadow: computedStyles.boxShadow
        };

        // Clean up
        document.body.removeChild(testDiv);
      });

      return results;
    });

    console.log('🎨 SendButton Class Test Results:');

    // Check each class and report status
    const expectedResults = {
      'w-11': { property: 'width', expected: '44px' },
      'h-11': { property: 'height', expected: '44px' },
      'rounded-full': { property: 'borderRadius', expected: '9999px' },
      'bg-blue-500': { property: 'backgroundColor', expected: 'rgb(59, 130, 246)' },
      'bg-gray-400': { property: 'backgroundColor', expected: 'rgb(156, 163, 175)' },
      'text-white': { property: 'color', expected: 'rgb(255, 255, 255)' },
      'text-lg': { property: 'fontSize', expected: '18px' },
      'font-semibold': { property: 'fontWeight', expected: '600' },
      'flex': { property: 'display', expected: 'flex' },
      'items-center': { property: 'alignItems', expected: 'center' },
      'justify-center': { property: 'justifyContent', expected: 'center' },
      'shadow-sm': { property: 'boxShadow', expected: 'contains shadow' }
    };

    let workingClasses = 0;
    let totalClasses = Object.keys(expectedResults).length;

    Object.entries(expectedResults).forEach(([className, { property, expected }]) => {
      const actual = sendButtonClassTest[className][property];
      const isWorking = property === 'boxShadow' ?
        (actual && actual !== 'none') :
        (actual === expected || (property === 'borderRadius' && actual.includes('999')));

      const status = isWorking ? '✅' : '❌';
      if (isWorking) workingClasses++;

      console.log(`  ${status} .${className}: ${property} = ${actual} ${isWorking ? '' : `(expected: ${expected})`}`);
    });

    console.log(`\n📊 Summary: ${workingClasses}/${totalClasses} classes working (${Math.round(workingClasses/totalClasses*100)}%)`);

    // Test if we can find the actual SendButton in the DOM
    console.log('\n🔍 Looking for SendButton in DOM...');
    const sendButtonInDOM = await page.evaluate(() => {
      // Look for TouchableOpacity with our classes
      const buttons = document.querySelectorAll('*');
      const sendButtonCandidates = [];

      buttons.forEach(button => {
        const className = button.className;
        if (typeof className === 'string' &&
            (className.includes('w-11') || className.includes('h-11') || className.includes('rounded-full'))) {
          sendButtonCandidates.push({
            tagName: button.tagName,
            className: className,
            textContent: button.textContent,
            computedStyles: {
              width: window.getComputedStyle(button).width,
              height: window.getComputedStyle(button).height,
              backgroundColor: window.getComputedStyle(button).backgroundColor,
              borderRadius: window.getComputedStyle(button).borderRadius
            }
          });
        }
      });

      return sendButtonCandidates;
    });

    console.log(`Found ${sendButtonInDOM.length} SendButton candidates:`);
    sendButtonInDOM.forEach((button, i) => {
      console.log(`  ${i + 1}. ${button.tagName}: ${button.className}`);
      console.log(`     Text: "${button.textContent}"`);
      console.log(`     Styles: ${JSON.stringify(button.computedStyles)}`);
    });

    // Save analysis
    const analysis = {
      timestamp: new Date().toISOString(),
      sendButtonClassTest,
      workingClasses,
      totalClasses,
      successRate: Math.round(workingClasses/totalClasses*100),
      sendButtonInDOM
    };

    require('fs').writeFileSync('sendbutton-class-test.json', JSON.stringify(analysis, null, 2));

    console.log('\n✅ SendButton class test complete!');
    console.log('📁 File created: sendbutton-class-test.json');

  } catch (error) {
    console.error('❌ Error during SendButton class test:', error);
  } finally {
    await browser.close();
  }
}

testSendButtonClasses().catch(console.error);
