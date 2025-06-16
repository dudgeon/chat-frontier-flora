const puppeteer = require('puppeteer-core');

async function testMetroBundle() {
  console.log('🚀 Testing Metro bundle endpoint directly...');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Test different Metro endpoints
  const endpoints = [
    'http://localhost:8081/',
    'http://localhost:8081/index.bundle?platform=web&dev=true&hot=false',
    'http://localhost:8081/index.html'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📱 Testing ${endpoint}...`);
      
      const response = await page.goto(endpoint, { 
        waitUntil: 'domcontentloaded', 
        timeout: 15000 
      });
      
      if (response) {
        console.log(`✅ Response status: ${response.status()}`);
        console.log(`📄 Content-Type: ${response.headers()['content-type']}`);
        
        const text = await page.content();
        console.log(`📄 Content length: ${text.length}`);
        console.log(`📄 Content preview: ${text.substring(0, 200)}...`);
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }
  
  await browser.close();
}

testMetroBundle();