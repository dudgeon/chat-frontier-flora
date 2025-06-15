const puppeteer = require('puppeteer');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function inspectConsole() {
  console.log('🔍 Starting console inspection for NativeWind CSS pipeline...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });

  const page = await browser.newPage();

  // Collect console messages
  const consoleMessages = [];
  const errors = [];

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();

    consoleMessages.push({
      type: type,
      text: text,
      timestamp: new Date().toISOString()
    });

    console.log(`📝 Console [${type.toUpperCase()}]: ${text}`);
  });

  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    console.log(`❌ Page Error: ${error.message}`);
  });

  try {
    console.log('🌐 Navigating to localhost:19006...');
    await page.goto('http://localhost:19006', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    console.log('⏱️ Waiting for initial page load...');
    await delay(5000);

    // Check if we're on the auth page or chat page
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // Look for auth form or chat interface
    const hasSignupForm = await page.$('[data-testid="signup-form"]').catch(() => null);
    const hasChatInterface = await page.$('[data-testid="chat-interface"]').catch(() => null);

    console.log(`🔍 Page elements found:`);
    console.log(`   Signup form: ${hasSignupForm ? 'YES' : 'NO'}`);
    console.log(`   Chat interface: ${hasChatInterface ? 'YES' : 'NO'}`);

    // Wait a bit more for any async loading
    await delay(3000);

    // Check final URL and page state
    const finalUrl = page.url();
    console.log(`📍 Final URL: ${finalUrl}`);

    // Look for NativeWind-specific console messages
    const nativeWindMessages = consoleMessages.filter(msg =>
      msg.text.toLowerCase().includes('nativewind') ||
      msg.text.toLowerCase().includes('tailwind') ||
      msg.text.toLowerCase().includes('css') ||
      msg.text.toLowerCase().includes('style')
    );

    console.log('\n🎨 NativeWind/CSS Related Messages:');
    if (nativeWindMessages.length === 0) {
      console.log('   No NativeWind/CSS messages found');
    } else {
      nativeWindMessages.forEach(msg => {
        console.log(`   [${msg.type.toUpperCase()}] ${msg.text}`);
      });
    }

    // Check for any CSS-related errors
    const cssErrors = errors.filter(error =>
      error.message.toLowerCase().includes('css') ||
      error.message.toLowerCase().includes('style') ||
      error.message.toLowerCase().includes('tailwind') ||
      error.message.toLowerCase().includes('postcss')
    );

    console.log('\n�� CSS-Related Errors:');
    if (cssErrors.length === 0) {
      console.log('   No CSS errors found');
    } else {
      cssErrors.forEach(error => {
        console.log(`   ❌ ${error.message}`);
      });
    }

    // Inspect the page for NativeWind injection
    const nativeWindCheck = await page.evaluate(() => {
      // Check for NativeWind styles in the document
      const stylesheets = Array.from(document.styleSheets);
      const hasNativeWindStyles = stylesheets.some(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          return rules.some(rule =>
            rule.cssText && (
              rule.cssText.includes('--tw-') ||
              rule.cssText.includes('.w-') ||
              rule.cssText.includes('.h-') ||
              rule.cssText.includes('.bg-')
            )
          );
        } catch (e) {
          return false;
        }
      });

      // Check for Tailwind CSS variables
      const rootStyles = getComputedStyle(document.documentElement);
      const hasTailwindVars = Array.from(rootStyles).some(prop =>
        prop.startsWith('--tw-')
      );

      // Check for any elements with NativeWind classes
      const elementsWithClasses = document.querySelectorAll('[class*="w-"], [class*="h-"], [class*="bg-"]');

      // Check if page loaded successfully
      const hasReactRoot = !!document.querySelector('#root');
      const pageTitle = document.title;

      return {
        hasNativeWindStyles,
        hasTailwindVars,
        elementsWithClassesCount: elementsWithClasses.length,
        stylesheetCount: stylesheets.length,
        sampleClasses: Array.from(elementsWithClasses).slice(0, 3).map(el => el.className),
        hasReactRoot,
        pageTitle,
        bodyContent: document.body ? document.body.innerText.substring(0, 200) : 'No body'
      };
    });

    console.log('\n🔍 NativeWind Pipeline Status:');
    console.log(`   Page title: ${nativeWindCheck.pageTitle}`);
    console.log(`   React root found: ${nativeWindCheck.hasReactRoot}`);
    console.log(`   Stylesheets found: ${nativeWindCheck.stylesheetCount}`);
    console.log(`   Has NativeWind styles: ${nativeWindCheck.hasNativeWindStyles}`);
    console.log(`   Has Tailwind variables: ${nativeWindCheck.hasTailwindVars}`);
    console.log(`   Elements with utility classes: ${nativeWindCheck.elementsWithClassesCount}`);
    console.log(`   Sample classes: ${nativeWindCheck.sampleClasses.join(', ')}`);
    console.log(`   Body content preview: ${nativeWindCheck.bodyContent}`);

    // Take a screenshot for visual reference
    await page.screenshot({
      path: 'console-inspection-screenshot.png',
      fullPage: true
    });

    // Save detailed analysis
    const analysis = {
      timestamp: new Date().toISOString(),
      finalUrl,
      consoleMessages,
      errors,
      nativeWindMessages,
      cssErrors,
      nativeWindCheck,
      summary: {
        totalConsoleMessages: consoleMessages.length,
        totalErrors: errors.length,
        nativeWindRelatedMessages: nativeWindMessages.length,
        cssRelatedErrors: cssErrors.length,
        pipelineWorking: nativeWindCheck.hasNativeWindStyles && nativeWindCheck.hasTailwindVars,
        pageLoaded: nativeWindCheck.hasReactRoot
      }
    };

    require('fs').writeFileSync('console-inspection-analysis.json', JSON.stringify(analysis, null, 2));

    console.log('\n📊 Analysis Summary:');
    console.log(`   Page loaded successfully: ${analysis.summary.pageLoaded ? '✅ YES' : '❌ NO'}`);
    console.log(`   Total console messages: ${analysis.summary.totalConsoleMessages}`);
    console.log(`   Total errors: ${analysis.summary.totalErrors}`);
    console.log(`   NativeWind messages: ${analysis.summary.nativeWindRelatedMessages}`);
    console.log(`   CSS errors: ${analysis.summary.cssRelatedErrors}`);
    console.log(`   Pipeline working: ${analysis.summary.pipelineWorking ? '✅ YES' : '❌ NO'}`);

    console.log('\n📁 Files generated:');
    console.log('   - console-inspection-screenshot.png');
    console.log('   - console-inspection-analysis.json');

  } catch (error) {
    console.error('❌ Error during console inspection:', error);
  } finally {
    await browser.close();
  }
}

inspectConsole().catch(console.error);
