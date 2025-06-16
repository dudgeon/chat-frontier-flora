const puppeteer = require('puppeteer-core');

async function testBundleDirect() {
  console.log('🚀 Testing direct bundle URL as recommended by GPT-o3...');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    // GPT-o3 recommended URL to trigger Metro compilation
    const bundleUrl = 'http://localhost:8081/index.bundle?platform=web&dev=true&hot=false';
    console.log(`📱 Testing bundle URL: ${bundleUrl}`);
    
    const response = await page.goto(bundleUrl, { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    
    if (response) {
      console.log(`✅ Response status: ${response.status()}`);
      console.log(`📄 Content-Type: ${response.headers()['content-type']}`);
      
      const text = await page.content();
      console.log(`📄 Content length: ${text.length}`);
      
      if (text.length > 1000) {
        console.log('✅ METRO COMPILED A BUNDLE!');
        console.log(`📄 Bundle preview: ${text.substring(0, 300)}...`);
        
        // Check if it looks like JavaScript
        if (text.includes('require(') || text.includes('module.exports') || text.includes('__webpack')) {
          console.log('✅ Bundle contains JavaScript - Metro is working!');
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

testBundleDirect();