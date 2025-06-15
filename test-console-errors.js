const puppeteer = require('puppeteer');

async function checkConsoleErrors() {
  console.log('🔍 Checking for console errors...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });

  const page = await browser.newPage();

  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    });
    console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
  });

  // Capture page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    console.log(`❌ Page Error: ${error.message}`);
  });

  // Capture failed requests
  const failedRequests = [];
  page.on('requestfailed', request => {
    failedRequests.push({
      url: request.url(),
      failure: request.failure().errorText,
      timestamp: new Date().toISOString()
    });
    console.log(`🚫 Failed Request: ${request.url()} - ${request.failure().errorText}`);
  });

  try {
    console.log('📍 Navigating to localhost:19006...');
    await page.goto('http://localhost:19006', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait a bit more for React to render
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check what's actually in the DOM
    const bodyContent = await page.evaluate(() => {
      return {
        innerHTML: document.body.innerHTML.substring(0, 1000),
        hasRoot: !!document.getElementById('root'),
        rootContent: document.getElementById('root')?.innerHTML?.substring(0, 500) || 'No root content',
        scripts: Array.from(document.scripts).map(s => s.src),
        stylesheets: Array.from(document.styleSheets).length
      };
    });

    console.log('📊 Page Content Analysis:', JSON.stringify(bodyContent, null, 2));

    // Take a screenshot
    await page.screenshot({ path: 'console-error-check.png', fullPage: true });

    // Save detailed analysis
    const analysis = {
      timestamp: new Date().toISOString(),
      consoleMessages,
      pageErrors,
      failedRequests,
      bodyContent,
      url: page.url()
    };

    require('fs').writeFileSync('console-error-analysis.json', JSON.stringify(analysis, null, 2));

    console.log('✅ Console error check complete!');
    console.log(`📁 Files created: console-error-check.png, console-error-analysis.json`);
    console.log(`📊 Summary: ${consoleMessages.length} console messages, ${pageErrors.length} page errors, ${failedRequests.length} failed requests`);

  } catch (error) {
    console.error('❌ Error during analysis:', error);
  } finally {
    await browser.close();
  }
}

checkConsoleErrors().catch(console.error);
