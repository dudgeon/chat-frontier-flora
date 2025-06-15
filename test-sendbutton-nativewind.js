const puppeteer = require('puppeteer');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testSendButtonNativeWind() {
  console.log('🔍 Testing SendButton NativeWind classes...');

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
    await delay(3000);

    // Check if we're on signup page and need to login
    const signupForm = await page.$('[data-testid="signup-form"]').catch(() => null);

    if (signupForm) {
      console.log('📝 On signup page, switching to login...');

      // Look for "Sign In" link to switch to login
      try {
        await page.click('text=Sign In');
        await delay(2000);
      } catch (e) {
        console.log('Could not find Sign In link, trying alternative approach...');
        // Try clicking any button that might switch to login
        const buttons = await page.$$('button, [role="button"]');
        for (let button of buttons) {
          const text = await page.evaluate(el => el.textContent, button);
          if (text && text.toLowerCase().includes('sign in')) {
            await button.click();
            await delay(2000);
            break;
          }
        }
      }

      console.log('🔑 Logging in with test credentials...');

      // Fill login form
      const emailInput = await page.$('input[type="email"], input[placeholder*="email" i]').catch(() => null);
      const passwordInput = await page.$('input[type="password"]').catch(() => null);

      if (emailInput && passwordInput) {
        await emailInput.type('test@example.com');
        await passwordInput.type('testpassword123');

        // Submit login form
        try {
          await page.click('button[type="submit"]');
        } catch (e) {
          // Try alternative submit button selectors
          const buttons = await page.$$('button, [role="button"]');
          for (let button of buttons) {
            const text = await page.evaluate(el => el.textContent, button);
            if (text && (text.toLowerCase().includes('sign in') || text.toLowerCase().includes('login'))) {
              await button.click();
              break;
            }
          }
        }

        console.log('⏳ Waiting for login to complete...');
        await delay(5000);
      } else {
        console.log('❌ Could not find login form inputs');
      }
    }

    // Now look for the MessageComposer on the chat page
    console.log('🔍 Looking for MessageComposer...');

    // Wait for chat page to load and look for message composer
    await page.waitForSelector('[style*="flexDirection"][style*="row"]', { timeout: 10000 }).catch(() => null);

    const messageComposer = await page.$('[style*="flexDirection"][style*="row"]').catch(() => null);

    if (!messageComposer) {
      console.log('❌ MessageComposer not found');
      console.log('🔍 Looking for any TouchableOpacity elements...');

      const touchableElements = await page.$$('div[role="button"]');
      console.log(`Found ${touchableElements.length} TouchableOpacity elements`);

      if (touchableElements.length > 0) {
        console.log('🔍 Inspecting first TouchableOpacity element...');
        const firstElement = touchableElements[0];

        const elementInfo = await page.evaluate(el => {
          const styles = window.getComputedStyle(el);
          const className = el.className;
          const innerHTML = el.innerHTML;

          return {
            className,
            innerHTML: innerHTML.substring(0, 100),
            computedStyles: {
              width: styles.width,
              height: styles.height,
              borderRadius: styles.borderRadius,
              backgroundColor: styles.backgroundColor,
              display: styles.display,
              alignItems: styles.alignItems,
              justifyContent: styles.justifyContent,
              boxShadow: styles.boxShadow
            }
          };
        }, firstElement);

        console.log('📊 First TouchableOpacity analysis:');
        console.log('   className:', elementInfo.className);
        console.log('   innerHTML:', elementInfo.innerHTML);
        console.log('   Computed styles:', elementInfo.computedStyles);
      }
    } else {
      console.log('✅ MessageComposer found!');

      // Look for the SendButton specifically
      const sendButton = await messageComposer.$('div[role="button"]').catch(() => null);

      if (sendButton) {
        console.log('✅ SendButton found!');

        const sendButtonAnalysis = await page.evaluate(button => {
          const styles = window.getComputedStyle(button);
          const className = button.className;
          const textContent = button.textContent;

          // Check for specific NativeWind classes
          const hasNativeWindClasses = {
            'w-11': className.includes('w-11'),
            'h-11': className.includes('h-11'),
            'rounded-full': className.includes('rounded-full'),
            'bg-blue-500': className.includes('bg-blue-500'),
            'bg-gray-400': className.includes('bg-gray-400'),
            'flex': className.includes('flex'),
            'items-center': className.includes('items-center'),
            'justify-center': className.includes('justify-center'),
            'shadow-sm': className.includes('shadow-sm')
          };

          return {
            className,
            textContent,
            hasNativeWindClasses,
            computedStyles: {
              width: styles.width,
              height: styles.height,
              borderRadius: styles.borderRadius,
              backgroundColor: styles.backgroundColor,
              display: styles.display,
              alignItems: styles.alignItems,
              justifyContent: styles.justifyContent,
              boxShadow: styles.boxShadow,
              color: styles.color,
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight
            },
            expectedVsActual: {
              width: { expected: '44px', actual: styles.width },
              height: { expected: '44px', actual: styles.height },
              borderRadius: { expected: '50%', actual: styles.borderRadius },
              backgroundColor: { expected: 'rgb(59, 130, 246) or rgb(156, 163, 175)', actual: styles.backgroundColor },
              display: { expected: 'flex', actual: styles.display },
              alignItems: { expected: 'center', actual: styles.alignItems },
              justifyContent: { expected: 'center', actual: styles.justifyContent }
            }
          };
        }, sendButton);

        console.log('\n📊 SendButton NativeWind Analysis:');
        console.log('   className:', sendButtonAnalysis.className);
        console.log('   textContent:', sendButtonAnalysis.textContent);

        console.log('\n🎨 NativeWind Classes Found:');
        Object.entries(sendButtonAnalysis.hasNativeWindClasses).forEach(([className, found]) => {
          console.log(`   ${className}: ${found ? '✅ YES' : '❌ NO'}`);
        });

        console.log('\n💻 Computed Styles:');
        Object.entries(sendButtonAnalysis.computedStyles).forEach(([prop, value]) => {
          console.log(`   ${prop}: ${value}`);
        });

        console.log('\n🎯 Expected vs Actual:');
        Object.entries(sendButtonAnalysis.expectedVsActual).forEach(([prop, comparison]) => {
          const match = comparison.actual === comparison.expected ||
                       (prop === 'backgroundColor' && (
                         comparison.actual.includes('59, 130, 246') ||
                         comparison.actual.includes('156, 163, 175')
                       ));
          console.log(`   ${prop}: ${match ? '✅' : '❌'} Expected: ${comparison.expected}, Actual: ${comparison.actual}`);
        });

        // Test button state change (type some text to enable button)
        const textInput = await messageComposer.$('input, textarea').catch(() => null);
        if (textInput) {
          console.log('\n🔄 Testing button state change...');
          await textInput.type('test message');
          await delay(1000);

          const enabledButtonAnalysis = await page.evaluate(button => {
            const styles = window.getComputedStyle(button);
            return {
              backgroundColor: styles.backgroundColor,
              className: button.className
            };
          }, sendButton);

          console.log('   Enabled state backgroundColor:', enabledButtonAnalysis.backgroundColor);
          console.log('   Enabled state className:', enabledButtonAnalysis.className);

          // Clear the input
          await textInput.click({ clickCount: 3 });
          await textInput.press('Backspace');
          await delay(1000);

          const disabledButtonAnalysis = await page.evaluate(button => {
            const styles = window.getComputedStyle(button);
            return {
              backgroundColor: styles.backgroundColor,
              className: button.className
            };
          }, sendButton);

          console.log('   Disabled state backgroundColor:', disabledButtonAnalysis.backgroundColor);
          console.log('   Disabled state className:', disabledButtonAnalysis.className);
        }
      } else {
        console.log('❌ SendButton not found in MessageComposer');
      }
    }

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'sendbutton-nativewind-test.png',
      fullPage: true
    });

    console.log('\n📁 Screenshot saved: sendbutton-nativewind-test.png');

  } catch (error) {
    console.error('❌ Error during SendButton test:', error);
  } finally {
    await browser.close();
  }
}

testSendButtonNativeWind().catch(console.error);
