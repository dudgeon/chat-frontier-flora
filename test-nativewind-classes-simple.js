const puppeteer = require('puppeteer');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testNativeWindClasses() {
  console.log('🔍 Testing NativeWind classes across the app...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });

  const page = await browser.newPage();

  try {
    console.log('🌐 Navigating to localhost:19006...');
    await page.goto('http://localhost:19006', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    console.log('⏱️ Waiting for page to load...');
    await delay(5000);

    // Comprehensive NativeWind class analysis
    const nativeWindAnalysis = await page.evaluate(() => {
      // Get all elements
      const allElements = document.querySelectorAll('*');

      // NativeWind classes we're looking for
      const targetClasses = [
        'w-11', 'h-11', 'rounded-full', 'bg-blue-500', 'bg-gray-400',
        'flex', 'items-center', 'justify-center', 'shadow-sm',
        'text-white', 'text-lg', 'font-semibold',
        'bg-green-500', 'rounded-lg', 'px-4', 'py-3'
      ];

      const results = {
        totalElements: allElements.length,
        elementsWithClasses: 0,
        classAnalysis: {},
        elementsFound: [],
        stylesheetAnalysis: {
          totalStylesheets: document.styleSheets.length,
          tailwindVariables: false,
          nativeWindClasses: []
        }
      };

      // Check each target class
      targetClasses.forEach(className => {
        const elements = document.querySelectorAll(`.${className}`);
        results.classAnalysis[className] = {
          found: elements.length > 0,
          count: elements.length,
          elements: []
        };

        if (elements.length > 0) {
          elements.forEach((el, index) => {
            const styles = window.getComputedStyle(el);
            results.classAnalysis[className].elements.push({
              tagName: el.tagName,
              className: el.className,
              textContent: el.textContent ? el.textContent.substring(0, 50) : '',
              computedStyles: {
                width: styles.width,
                height: styles.height,
                backgroundColor: styles.backgroundColor,
                borderRadius: styles.borderRadius,
                display: styles.display,
                alignItems: styles.alignItems,
                justifyContent: styles.justifyContent
              }
            });
          });
        }
      });

      // Check for any elements with className containing our target classes
      allElements.forEach(el => {
        if (el.className && typeof el.className === 'string') {
          const hasTargetClass = targetClasses.some(cls => el.className.includes(cls));
          if (hasTargetClass) {
            results.elementsWithClasses++;
            results.elementsFound.push({
              tagName: el.tagName,
              className: el.className,
              textContent: el.textContent ? el.textContent.substring(0, 50) : '',
              matchingClasses: targetClasses.filter(cls => el.className.includes(cls))
            });
          }
        }
      });

      // Check stylesheets for Tailwind content
      try {
        for (let i = 0; i < document.styleSheets.length; i++) {
          const sheet = document.styleSheets[i];
          try {
            const rules = sheet.cssRules || sheet.rules;
            if (rules) {
              for (let j = 0; j < Math.min(rules.length, 100); j++) {
                const rule = rules[j];
                if (rule.cssText) {
                  // Check for Tailwind variables
                  if (rule.cssText.includes('--tw-')) {
                    results.stylesheetAnalysis.tailwindVariables = true;
                  }

                  // Check for our specific classes
                  targetClasses.forEach(className => {
                    if (rule.cssText.includes(`.${className}`)) {
                      results.stylesheetAnalysis.nativeWindClasses.push(className);
                    }
                  });
                }
              }
            }
          } catch (e) {
            // Skip cross-origin stylesheets
          }
        }
      } catch (e) {
        console.log('Error analyzing stylesheets:', e);
      }

      return results;
    });

    console.log('\n📊 NativeWind Class Analysis Results:');
    console.log(`   Total elements: ${nativeWindAnalysis.totalElements}`);
    console.log(`   Elements with target classes: ${nativeWindAnalysis.elementsWithClasses}`);

    console.log('\n🎨 Individual Class Analysis:');
    Object.entries(nativeWindAnalysis.classAnalysis).forEach(([className, data]) => {
      const status = data.found ? '✅' : '❌';
      console.log(`   ${className}: ${status} (${data.count} elements)`);

      if (data.found && data.elements.length > 0) {
        data.elements.forEach((el, index) => {
          console.log(`     Element ${index + 1}: ${el.tagName} - "${el.textContent}"`);
          console.log(`       className: ${el.className}`);
          console.log(`       styles: width=${el.computedStyles.width}, height=${el.computedStyles.height}, bg=${el.computedStyles.backgroundColor}`);
        });
      }
    });

    console.log('\n📋 Elements with Target Classes:');
    if (nativeWindAnalysis.elementsFound.length > 0) {
      nativeWindAnalysis.elementsFound.forEach((el, index) => {
        console.log(`   ${index + 1}. ${el.tagName}: "${el.textContent}"`);
        console.log(`      className: ${el.className}`);
        console.log(`      matching classes: ${el.matchingClasses.join(', ')}`);
      });
    } else {
      console.log('   No elements found with target NativeWind classes');
    }

    console.log('\n📄 Stylesheet Analysis:');
    console.log(`   Total stylesheets: ${nativeWindAnalysis.stylesheetAnalysis.totalStylesheets}`);
    console.log(`   Has Tailwind variables: ${nativeWindAnalysis.stylesheetAnalysis.tailwindVariables ? '✅' : '❌'}`);
    console.log(`   NativeWind classes in CSS: ${nativeWindAnalysis.stylesheetAnalysis.nativeWindClasses.length > 0 ? '✅' : '❌'}`);

    if (nativeWindAnalysis.stylesheetAnalysis.nativeWindClasses.length > 0) {
      console.log(`   Found classes: ${nativeWindAnalysis.stylesheetAnalysis.nativeWindClasses.join(', ')}`);
    }

    // Summary
    const workingClasses = Object.values(nativeWindAnalysis.classAnalysis).filter(data => data.found).length;
    const totalClasses = Object.keys(nativeWindAnalysis.classAnalysis).length;
    const successRate = Math.round((workingClasses / totalClasses) * 100);

    console.log('\n🎯 NativeWind Pipeline Status:');
    console.log(`   Working classes: ${workingClasses}/${totalClasses} (${successRate}%)`);
    console.log(`   Pipeline status: ${successRate > 50 ? '✅ WORKING' : successRate > 0 ? '⚠️ PARTIAL' : '❌ BROKEN'}`);

    // Take screenshot
    await page.screenshot({
      path: 'nativewind-classes-test.png',
      fullPage: true
    });

    console.log('\n📁 Screenshot saved: nativewind-classes-test.png');

  } catch (error) {
    console.error('❌ Error during NativeWind test:', error);
  } finally {
    await browser.close();
  }
}

testNativeWindClasses().catch(console.error);
