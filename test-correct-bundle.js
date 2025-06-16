const puppeteer = require('puppeteer-core');

async function testCorrectBundle() {
  console.log('🚀 Testing correct bundle URL found in HTML...');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    // The actual bundle URL from the HTML
    const bundleUrl = 'http://localhost:8081/index.ts.bundle?platform=web&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.routerRoot=app';
    console.log(`📱 Testing actual bundle URL from HTML...`);
    
    const response = await page.goto(bundleUrl, { 
      waitUntil: 'domcontentloaded', 
      timeout: 45000 
    });
    
    if (response) {
      console.log(`✅ Response status: ${response.status()}`);
      console.log(`📄 Content-Type: ${response.headers()['content-type']}`);
      
      const text = await page.content();
      console.log(`📄 Content length: ${text.length}`);
      
      if (text.length > 1000) {
        console.log('✅ METRO COMPILED THE ACTUAL BUNDLE!');
        console.log(`📄 Bundle preview: ${text.substring(0, 300)}...`);
        
        // Check if it looks like JavaScript
        if (text.includes('require(') || text.includes('module.exports') || text.includes('__webpack') || text.includes('Object.defineProperty')) {
          console.log('✅ Bundle contains JavaScript - Metro is working correctly!');
        } else {
          console.log('⚠️  Bundle doesn\'t look like JavaScript');
        }
      } else {
        console.log(`⚠️  Bundle is very small (${text.length} chars), might be an error`);
        console.log(`📄 Full content: ${text}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Bundle request failed:', error.message);
  }
  
  await browser.close();
}

testCorrectBundle();