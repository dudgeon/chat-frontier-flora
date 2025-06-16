const puppeteer = require('puppeteer');

async function testLoginForm() {
  console.log('🔍 Testing minimal login form...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('📡 Navigating to localhost:8081...');
    await page.goto('http://localhost:8081', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('🔍 Checking page content...');
    
    // Check if we see login form instead of test screen
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('Page content preview:', pageText.substring(0, 200));
    
    if (pageText.includes('🚀 Metro Minimal Test')) {
      console.log('❌ STILL SHOWING TEST SCREEN');
      return false;
    }
    
    if (pageText.includes('Welcome Back') || pageText.includes('Email Address')) {
      console.log('✅ LOGIN FORM DETECTED!');
      
      // Check for specific login elements
      const emailInput = await page.$('input[type="email"], input[placeholder*="email" i]');
      const passwordInput = await page.$('input[type="password"], input[placeholder*="password" i]');
      
      console.log('Email input found:', !!emailInput);
      console.log('Password input found:', !!passwordInput);
      
      return true;
    }
    
    console.log('⚠️ UNEXPECTED CONTENT - Neither test screen nor login form');
    return false;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

testLoginForm().then(success => {
  console.log('🎯 Test result:', success ? 'SUCCESS' : 'FAILED');
  process.exit(success ? 0 : 1);
});